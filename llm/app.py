from docarray import DocumentArray, Document
from jina import Flow
import os

API_KEY = 'c5c5b3e44354a5c1aec94b0b03eafc4e'
os.environ['JINA_AUTH_TOKEN'] = API_KEY
# add the jina api Key


doc = DocumentArray([Document(uri='test.pdf')]) # adjust to your own pdf
doc[0].load_uri_to_blob()
print(doc[0])

f = Flow().add(
    uses='jinahub+docker://PDFSegmenter',
)
with f:
    resp = f.post(on='/craft', inputs=doc)
    print(f'{[c.mime_type for c in resp[0].chunks]}')