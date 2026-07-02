import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { listPresets, createPreset, deletePreset } from '../services/presetService.js';

const router = Router();

router.use(requireAuth);

router.get('/', async (req, res) => {
  // req.user is guaranteed set here: requireAuth runs for every route on this router
  const presets = await listPresets(req.user!.id);
  res.status(200).json(presets);
});

router.post('/', async (req, res) => {
  const { name, workTime, restTime, rounds } = req.body as {
    name?: string;
    workTime?: number;
    restTime?: number;
    rounds?: number;
  };

  if (!name || !workTime || !restTime || !rounds) {
    res.status(400).json({ error: 'name, workTime, restTime, and rounds are required' });
    return;
  }

  const preset = await createPreset(req.user!.id, { name, workTime, restTime, rounds });
  res.status(201).json(preset);
});

router.delete('/:id', async (req, res) => {
  const deleted = await deletePreset(req.user!.id, req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'Preset not found' });
    return;
  }
  res.status(200).json({ success: true });
});

export default router;
