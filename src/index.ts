import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";
import { BriefcaseDb, BriefcaseManager, IModelHost, IModelHostConfiguration, SnapshotDb } from "@itwin/core-backend";
import { IModelTransformer, IModelTransformOptions } from "@itwin/imodel-transformer";
import { AccessToken, GuidString, Logger, LogLevel } from "@itwin/core-bentley";
import { IModel } from "@itwin/core-common";
import { NodeCliAuthorizationClient } from "@itwin/node-cli-authorization";
import { BackendIModelsAccess } from "@itwin/imodels-access-backend";

dotenv.config();

class TransformerApp {
  private sourceDb?: BriefcaseDb;
  private targetDb?: BriefcaseDb;
  private authClient?: NodeCliAuthorizationClient;

  private async initializeIModelHost(): Promise<void> {
    const config = new IModelHostConfiguration();
    config.hubAccess = new BackendIModelsAccess();
    await IModelHost.startup(config);
    Logger.setLevelDefault(LogLevel.Info);
    console.log("✓ IModelHost initialized");
  }

  private async getAccessToken(): Promise<AccessToken> {
    const clientId = process.env.IMJS_CLIENT_ID;
    const redirectUri = process.env.IMJS_REDIRECT_URI || "http://localhost:3000";
    
    if (!clientId) {
      throw new Error("IMJS_CLIENT_ID is required");
    }

    console.log("Initializing OAuth authentication...");
    console.log("A browser window will open for you to sign in.");

    this.authClient = new NodeCliAuthorizationClient({
      clientId,
      redirectUri,
      scope: "itwin-platform",
    });

    await this.authClient.signIn();
    const token = await this.authClient.getAccessToken();
    
    console.log("✓ Successfully authenticated");
    return token;
  }

  private async openSourceIModel(
    accessToken: AccessToken,
    iTwinId: GuidString,
    iModelId: GuidString
  ): Promise<BriefcaseDb> {
    console.log("Downloading source iModel...");
    
    const briefcaseProps = await BriefcaseManager.downloadBriefcase({
      accessToken,
      iTwinId,
      iModelId,
    });

    this.sourceDb = await BriefcaseDb.open({ fileName: briefcaseProps.fileName });
    console.log(`✓ Source iModel opened: ${this.sourceDb.pathName}`);
    return this.sourceDb;
  }

  private async createTargetIModel(): Promise<BriefcaseDb> {
    console.log("Creating target iModel...");
    
    const targetPath = path.join(process.cwd(), "output", `transformed-${Date.now()}.bim`);
    const outputDir = path.dirname(targetPath);
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    this.targetDb = SnapshotDb.createEmpty(targetPath, {
      rootSubject: { name: "Transformed iModel" },
    }) as any as BriefcaseDb;

    console.log(`✓ Target iModel created: ${this.targetDb.pathName}`);
    return this.targetDb;
  }

  private createTransformer(sourceDb: BriefcaseDb, targetDb: BriefcaseDb): IModelTransformer {
    class CustomTransformer extends IModelTransformer {
      constructor(source: BriefcaseDb, target: BriefcaseDb, options?: IModelTransformOptions) {
        super(source, target, options);
      }
    }

    return new CustomTransformer(sourceDb, targetDb);
  }

  private async applyTransformations(): Promise<void> {
    if (!this.sourceDb || !this.targetDb) {
      throw new Error("Source or target iModel not initialized");
    }

    console.log("Applying transformations...");

    const transformer = this.createTransformer(this.sourceDb, this.targetDb);

    try {
      await transformer.processSchemas();
      await transformer.processModel(IModel.repositoryModelId);
      
      this.targetDb.saveChanges("Applied transformations");
      console.log("✓ Transformations applied successfully");
    } finally {
      transformer.dispose();
    }
  }

  private async processTransformedModel(): Promise<void> {
    if (!this.targetDb) {
      throw new Error("Target iModel not initialized");
    }

    console.log("Processing transformed iModel...");

    let elementCount = 0;
    this.targetDb.withSqliteStatement("SELECT COUNT(*) FROM bis_Element", (stmt) => {
      if (stmt.step()) {
        elementCount = stmt.getValueInteger(0);
      }
    });

    console.log(`✓ Processed iModel contains ${elementCount} elements`);
  }

  private async cleanup(): Promise<void> {
    if (this.sourceDb?.isOpen) {
      this.sourceDb.close();
      console.log("✓ Source iModel closed");
    }

    if (this.targetDb?.isOpen) {
      this.targetDb.close();
      console.log("✓ Target iModel closed");
    }

    await IModelHost.shutdown();
    console.log("✓ IModelHost shutdown");
  }

  public async run(): Promise<void> {
    try {
      await this.initializeIModelHost();

      const iTwinId = process.env.ITWIN_ID;
      const iModelId = process.env.IMODEL_ID;

      if (!iTwinId || !iModelId) {
        throw new Error("Missing required environment variables: ITWIN_ID and IMODEL_ID");
      }

      const accessToken = await this.getAccessToken();
      await this.openSourceIModel(accessToken, iTwinId, iModelId);
      await this.createTargetIModel();
      await this.applyTransformations();
      await this.processTransformedModel();

      console.log("\n✓ Transformation completed successfully!");
    } catch (error) {
      console.error("Error during transformation:", error);
      throw error;
    } finally {
      await this.cleanup();
    }
  }
}

const app = new TransformerApp();
app.run().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
