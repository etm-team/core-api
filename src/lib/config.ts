function pathToEnvVar(path: string): string {
  return path
    .split('.')
    .map(part => part.toUpperCase())
    .join('_');
}
export default {
  has(path: string): boolean {
    const envVar = pathToEnvVar(path);
    return process.env[envVar] !== undefined;
  },

  get(path: string): string | undefined {
    const envVar = pathToEnvVar(path);
    return process.env[envVar];
  }
};
