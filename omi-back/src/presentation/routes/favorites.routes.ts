import { Router, Request, Response } from 'express';
import { DatabaseConnection } from '../../infrastructure/database/connection';

import { Favorite } from '../../domain/entities/favorite.entity';

const router = Router();
const db = DatabaseConnection.getInstance();

/**
 * GET /favorites/:userId
 * Lista todos los favoritos de un usuario
 */
router.get('/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const favorites = await db.getCollection<Favorite>('favorites')
      .find({ userId })
      .toArray();
    res.json(favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error obteniendo favoritos' });
  }
});

/**
 * POST /favorites
 * Agrega un nuevo favorito
 * Body: { userId, pexelsId, mediaType }
 */
router.post('/', async (req: Request, res: Response) => {
  const { userId, pexelsId, mediaType } = req.body;
  try {
    const collection = db.getCollection<Favorite>('favorites');

    // Evita duplicados
    const exists = await collection.findOne({ userId, pexelsId });
    if (exists) {
      return res.status(400).json({ message: 'Ya está en favoritos' });
    }

    const favorite = {
      userId,
      pexelsId,
      mediaType,
      createdAt: new Date(),
    };

    await collection.insertOne(favorite);
    res.status(201).json(favorite);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error agregando favorito' });
  }
});

/**
 * DELETE /favorites/:userId/:pexelsId
 * Elimina un favorito específico
 */
router.delete('/:userId/:pexelsId', async (req: Request, res: Response) => {
  const { userId, pexelsId } = req.params;
  try {
    const result = await db.getCollection('favorites')
      .deleteOne({ userId, pexelsId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No se encontró el favorito' });
    }

    res.json({ message: 'Favorito eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error eliminando favorito' });
  }
});

export default router;
