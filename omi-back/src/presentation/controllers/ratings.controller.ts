import { Request, Response } from 'express';
import { DatabaseConnection } from '../../infrastructure/database/connection';


export class RatingsController {
  private db = DatabaseConnection.getInstance();

  async list(req: Request, res: Response) {
    const { pexelsId } = req.params;
    try {
      const ratings = await this.db.getCollection('ratings').find({ pexelsId }).toArray();
      res.json(ratings);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error obteniendo ratings' });
    }
  }

  async add(req: Request, res: Response) {
    const { userId, pexelsId, score, comment } = req.body;
    try {
      const collection = this.db.getCollection('ratings');
      const existing = await collection.findOne({ userId, pexelsId });

      if (existing) return res.status(400).json({ message: 'Ya calificaste este contenido' });

      const rating = { userId, pexelsId, score, comment, createdAt: new Date() };
      await collection.insertOne(rating);
      res.status(201).json(rating);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error agregando rating' });
    }
  }

  async update(req: Request, res: Response) {
    const { userId, pexelsId } = req.params;
    const { score, comment } = req.body;
    try {
      const result = await this.db.getCollection('ratings').updateOne(
        { userId, pexelsId },
        { $set: { score, comment } }
      );
      if (result.matchedCount === 0) return res.status(404).json({ message: 'No se encontró el rating' });
      res.json({ message: 'Rating actualizado' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error actualizando rating' });
    }
  }

  async remove(req: Request, res: Response) {
    const { userId, pexelsId } = req.params;
    try {
      const result = await this.db.getCollection('ratings').deleteOne({ userId, pexelsId });
      if (result.deletedCount === 0) return res.status(404).json({ message: 'No se encontró el rating' });
      res.json({ message: 'Rating eliminado' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error eliminando rating' });
    }
  }
}
