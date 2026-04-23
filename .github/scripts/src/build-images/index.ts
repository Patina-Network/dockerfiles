import {
  DockerClient,
  EnvClient,
  EnvClientStrategy,
  Utils,
} from "@tahminator/pipeline";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const { ver, shouldUpload } = await yargs(hideBin(process.argv))
  .option("ver", {
    type: "string",
    demandOption: true,
  })
  .option("shouldUpload", {
    type: "boolean",
    demandOption: true,
    default: true,
  })
  .strict()
  .parse();

const targets = ["pg-az"] as const;

export async function main() {
  const envClient = EnvClient.create(EnvClientStrategy.SOPS);
  const { dockerHubPat, dockerHubUsername } = parseCiEnv(
    await envClient.readFromEnv("secrets.yaml"),
  );
  await using dockerClient = await DockerClient.create(
    dockerHubUsername,
    dockerHubPat,
  );

  for (const target of targets) {
    const dir = `src/${target}` as const;
    const dockerFileLocation = `${dir}/Dockerfile` as const;
    console.log(Utils.Colors.cyan(`Building ${dockerFileLocation}...`));
    await dockerClient.buildImage({
      dockerFileLocation,
      shouldUpload,
      dockerRepository: target,
      tags: ["latest", ver],
    });
  }
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

main()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
