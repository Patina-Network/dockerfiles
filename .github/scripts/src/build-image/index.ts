import {
  DockerClient,
  EnvClient,
  EnvClientStrategy,
} from "@tahminator/pipeline";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const { tag } = await yargs(hideBin(process.argv))
  .option("tag", {
    type: "string",
    demandOption: true,
  })
  .strict()
  .parse();

export async function main() {
  const envClient = EnvClient.create(EnvClientStrategy.SOPS);
  const { dockerHubPat, dockerHubUsername } = parseCiEnv(
    await envClient.readFromEnv("secrets.yaml"),
  );
  await using dockerClient = await DockerClient.create(
    dockerHubUsername,
    dockerHubPat,
  );

  await dockerClient.buildImage({
    dockerFileLocation: "src/Dockerfile",
    shouldUpload: true,
    dockerRepository: "pg-az",
    tags: ["latest", tag],
  });
}

function parseCiEnv(ciEnv: Record<string, string>) {
  const dockerHubPat = (() => {
    const v = ciEnv["DOCKER_HUB_PAT"];
    if (!v) {
      throw new Error("Missing DOCKER_HUB_PAT from .env.ci");
    }
    return v;
  })();

  const dockerHubUsername = (() => {
    const v = ciEnv["DOCKER_HUB_USERNAME"];
    if (!v) {
      throw new Error("Missing DOCKER_HUB_USERNAME from .env.ci");
    }
    return v;
  })();

  return { dockerHubPat, dockerHubUsername };
}
