export const ASSET_SOURCE_TYPES = Object.freeze(["procedural", "local", "external"]);

export function assetSourceMetadata(source = {}) {
  const sourceType = ASSET_SOURCE_TYPES.includes(source.sourceType) ? source.sourceType : "procedural";
  const license = typeof source.license === "string" ? source.license : "";
  const path = typeof source.path === "string" ? source.path : null;
  const explicitlyApproved = source.approvedForUse === true;
  const approvedForUse = sourceType === "external"
    ? explicitlyApproved && license.trim().length > 0
    : source.approvedForUse === false
      ? false
      : true;

  return {
    id: typeof source.id === "string" ? source.id : null,
    family: typeof source.family === "string" ? source.family : null,
    sourceType,
    path,
    localPath: typeof source.localPath === "string" ? source.localPath : path,
    license,
    author: typeof source.author === "string" ? source.author : "",
    sourceUrl: typeof source.sourceUrl === "string" ? source.sourceUrl : null,
    attributionRequired: Boolean(source.attributionRequired),
    commercialUseAllowed: source.commercialUseAllowed === false ? false : sourceType === "external" ? approvedForUse : true,
    approvedForUse,
    fileFormat: typeof source.fileFormat === "string" ? source.fileFormat : sourceType === "procedural" ? "procedural" : "",
    notes: typeof source.notes === "string" ? source.notes : "",
    approvalStatus: approvedForUse ? "approved" : "unapproved"
  };
}
