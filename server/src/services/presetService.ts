import { prisma } from '../lib/prisma.js';
import type { Preset } from '../../../generated/prisma/client.js';

export interface PresetInput {
  name: string;
  workTime: number;
  restTime: number;
  rounds: number;
}

export async function listPresets(userId: string): Promise<Preset[]> {
  return prisma.preset.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
}

export async function createPreset(userId: string, input: PresetInput): Promise<Preset> {
  return prisma.preset.create({ data: { ...input, userId } });
}

export async function deletePreset(userId: string, presetId: string): Promise<boolean> {
  const result = await prisma.preset.deleteMany({ where: { id: presetId, userId } });
  return result.count > 0;
}
