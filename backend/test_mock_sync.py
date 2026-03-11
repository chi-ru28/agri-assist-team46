import asyncio
from unittest.mock import AsyncMock, patch, MagicMock
from routes.vision_routes import analyze_crop

async def test():
    try:
        from fastapi import UploadFile
        from sqlalchemy.orm import Session
        db = MagicMock(spec=Session)
        u = MagicMock()
        u.id = 'fake-id'
        u.preferred_language = 'en'
        db.query().filter().first.return_value = u
        
        im = AsyncMock(spec=UploadFile)
        im.content_type = 'image/jpeg'
        im.read.return_value = b'123'
        
        with patch('routes.vision_routes.client.models.generate_content') as m:
            resp = MagicMock()
            resp.text = '{"disease_name": "test", "confidence_score": 0.99, "analysis_result": "ok", "recommendation": {"chemical": "none", "precautions": "none"}, "organic_alternative": "none"}'
            m.return_value = resp
            
            res = await analyze_crop(image=im, crop_name='test', db=db, current_user={'sub': 'fake-id'})
            print('SUCCESS:', res)
    except Exception as e:
        import traceback
        traceback.print_exc()

asyncio.run(test())
