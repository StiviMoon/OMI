import { Request, Response } from 'express';
import { DatabaseConnection } from '../../infrastructure/database/connection';


export class FavoritesController {
  private db = DatabaseConnection.getInstance();

  async list(req: Request, res: Response) {
    const { userId } = req.params;
    try {
      const favorites = await this.db.getCollection('favorites').find({ userId }).toArray();
      res.json(favorites);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error obteniendo favoritos' });
    }
  }

  async add(req: Request, res: Response) {
    const { userId, pexelsId, mediaType } = req.body;
    try {
      const collection = this.db.getCollection('favorites');
      const exists = await collection.findOne({ userId, pexelsId });

      if (exists) return res.status(400).json({ message: 'Ya está en favoritos' });

      const favorite = { userId, pexelsId, mediaType, createdAt: new Date() };
      await collection.insertOne(favorite);
      res.status(201).json(favorite);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error agregando favorito' });
    }
  }

  async remove(req: Request, res: Response) {
    const { userId, pexelsId } = req.params;
    try {
      const result = await this.db.getCollection('favorites').deleteOne({ userId, pexelsId });
      if (result.deletedCount === 0) return res.status(404).json({ message: 'No se encontró el favorito' });
      res.json({ message: 'Favorito eliminado' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error eliminando favorito' });
    }
  }
}
