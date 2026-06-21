export const ASSET_SOURCE_TYPES = Object.freeze(["procedural", "local", "external"]);

export function assetSourceMetadata(source = {}) {
  const sourceType = ASSET_SOURCE_TYPES.includes(source.sourceType) ? source.sourceType : "procedural";
  const license = typeof source.license === "string" ? source.license : "";
  const explicitlyApproved = source.approvedForUse === true;
  const approvedForUse = sourceType === "external"
    ? explicitlyApproved && license.trim().length > 0
    : source.approvedForUse === false
      ? false
      : true;

  return {
    sourceType,
    path: typeof source.path === "string" ? source.path : null,
    license,
    author: typeof source.author === "string" ? source.author : "",
    sourceUrl: typeof source.sourceUrl === "string" ? source.sourceUrl : null,
    notes: typeof source.notes === "string" ? source.notes : "",
    approvedForUse
  };
}
