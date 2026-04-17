import { Router } from 'express';
import { consultarJurisprudencia } from '../services/jurisprudenciaService.js';

export const jurisprudenciaRoutes = Router();

jurisprudenciaRoutes.post('/validar', async (req, res) => {
  try {
    const { termo, tribunal, tipoBusca } = req.body;
    
    if (!termo) {
      return res.status(400).json({ error: 'O termo de busca (processo ou trecho) é obrigatório.' });
    }

    const resultado = await consultarJurisprudencia(termo, tribunal, tipoBusca);
    res.json(resultado);
  } catch (error) {
    console.error('Erro na rota de jurisprudência:', error);
    res.status(500).json({ error: 'Erro ao validar jurisprudência', details: (error as Error).message });
  }
});
