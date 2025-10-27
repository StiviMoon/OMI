import { Router, Request, Response } from 'express';
import { DatabaseConnection } from '../../infrastructure/database/connection';

import { Rating } from '../../domain/entities/rating.entity';

const router = Router();
const db = DatabaseConnection.getInstance();

/**
 * GET /ratings/:pexelsId
 * Obtiene todas las calificaciones de una foto o video
 */
router.get('/:pexelsId', async (req: Request, res: Response) => {
  const { pexelsId } = req.params;
  try {
    const ratings = await db.getCollection<Rating>('ratings')
      .find({ pexelsId })
      .toArray();
    res.json(ratings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error obteniendo ratings' });
  }
});

/**
 * POST /ratings
 * Agrega una nueva calificación
 * Body: { userId, pexelsId, score, comment }
 */
router.post('/', async (req: Request, res: Response) => {
  const { userId, pexelsId, score, comment } = req.body;
  try {
    const collection = db.getCollection<Rating>('ratings');

    const existing = await collection.findOne({ userId, pexelsId });
    if (existing) {
      return res.status(400).json({ message: 'Ya calificaste este contenido' });
    }

    const rating = {
      userId,
      pexelsId,
      score,
      comment,
      createdAt: new Date(),
    };

    await collection.insertOne(rating);
    res.status(201).json(rating);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error agregando rating' });
  }
});

/**
 * PUT /ratings/:userId/:pexelsId
 * Actualiza una calificación
 */
router.put('/:userId/:pexelsId', async (req: Request, res: Response) => {
  const { userId, pexelsId } = req.params;
  const { score, comment } = req.body;
  try {
    const result = await db.getCollection('ratings')
      .updateOne({ userId, pexelsId }, { $set: { score, comment } });

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'No se encontró el rating' });
    }

    res.json({ message: 'Rating actualizado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error actualizando rating' });
  }
});

/**
 * DELETE /ratings/:userId/:pexelsId
 * Elimina una calificación
 */
router.delete('/:userId/:pexelsId', async (req: Request, res: Response) => {
  const { userId, pexelsId } = req.params;
  try {
    const result = await db.getCollection('ratings')
      .deleteOne({ userId, pexelsId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No se encontró el rating' });
    }

    res.json({ message: 'Rating eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error eliminando rating' });
  }
});

export default router;
