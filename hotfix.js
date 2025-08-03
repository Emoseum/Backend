export async function updateDiaryFromAI(req, res) {
  try {
    const { diary_id } = req.body;
    console.log('[Server] 받은 요청 body:', req.body);

    if (!diary_id) {
      return res.status(400).json({ error: 'Missing diary_id' });
    }

    // AI 서버 호출 없이 바로 DB 업데이트
    const result = await Diary.findByIdAndUpdate(
      diary_id,
      { 
        $set: {
          keywords: ['NULL'],
          title: 'Untitled Dirary',
          updatedAt: new Date().toISOString()
        }
      },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ error: 'Diary not found' });
    }

    res.status(200).json({ 
      message: 'Diary updated successfully',
      diary: result 
    });

  } catch (err) {
    console.error('Server Error :', err);
    res.status(500).json({ error: err.message });
  }
}

export const updateDiaryFromAISession = updateDiaryFromAI;