function applyRegex(regex: RegExp, s: string): string | null {
  const match = s.match(regex);
  return match ? match[1] : null;
}

export const parseZ: (s: string) => string | null = applyRegex.bind(
  null,
  /Z(\d+)/
);
export const parseTime: (s: string) => string | null = applyRegex.bind(
  null,
  /time(\d+)/
);
export const parseXY: (s: string) => string | null = applyRegex.bind(
  null,
  /XY(\d+)/
);
export const parseChannel: (s: string) => string | null = applyRegex.bind(
  null,
  /channel(.*?)[_\.]/
);

interface FilenameMetadata {
  t: string | null;
  xy: string | null;
  z: string | null;
  chan: string | null;
}

interface NumericMetadata {
  t: number | null;
  xy: number | null;
  z: number | null;
  chan: string | null;
}

export function getFilenameMetadata(filename: string): FilenameMetadata {
  return {
    t: parseTime(filename),
    xy: parseXY(filename),
    z: parseZ(filename),
    chan: parseChannel(filename)
  };
}

function stringToNumber(val: string | null): number | null {
  return val === null ? null : +val;
}

export function getNumericMetadata(filename: string): NumericMetadata {
  const metadata = getFilenameMetadata(filename);
  return {
    t: stringToNumber(metadata.t),
    xy: stringToNumber(metadata.xy),
    z: stringToNumber(metadata.z),
    chan: metadata.chan
  };
}

export function collectFilenameMetadata(
  filenames: string[]
): { xy: string[]; t: string[]; z: string[]; chan: string[] } {
  const times = filenames.map(parseTime);
  const xys = filenames.map(parseXY);
  const zs = filenames.map(parseZ);
  const channels = filenames.map(parseChannel);

  return {
    t: times.filter(d => d !== null).sort() as string[],
    xy: xys.filter(d => d !== null).sort() as string[],
    z: zs.filter(d => d !== null).sort() as string[],
    chan: channels.filter(d => d !== null).sort() as string[]
  };
}
