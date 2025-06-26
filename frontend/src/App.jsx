import { useState } from 'react'
import { Toaster, toast } from 'sonner';
import Button from './component/button';
import Input from './component/input';


function App() {

  const [url, setUrl] = useState('');
  const [width, setWidth] = useState('800');
  const [height, setHeight] = useState('600');
  const [scale, setScale] = useState('4');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [imgSrc, setImgSrc] = useState('');
  const [fullPage, setFullPage] = useState(false);

  const [filename, setFilename] = useState('screenshot.png');
  const [customclass, setCustomClass] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setImgSrc('');
    try {
      const params = new URLSearchParams({
        url, width, height, scale, customclass, fullPage: fullPage ? 'true' : 'false'
      });

      const Image = await fetch(`http://localhost:3000/screenshot?${params.toString()}`);
      if (!Image.ok) throw new Error('Failed to get Screenshot.');

      const blob = await Image.blob();
      setImgSrc(URL.createObjectURL(blob));

    } catch (err) {
      setError(err.message);
    }


    setLoading(false);


  };

  const copyImageToClipboard = async () => {
    if (!imgSrc) return;
    try {
      const data = await fetch(imgSrc);
      const blob = await data.blob();
      await navigator.clipboard.write([
        new window.ClipboardItem({ [blob.type]: blob })
      ]);
      toast.success('Image copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy image: ' + err.message);
    }
  };

  const downloadImageToClipboard = () => {
    if (!imgSrc) return;
    const link = document.createElement('a');
    link.href = imgSrc;
    link.download = filename || 'screenshot.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  console.log(customclass);


  return (
    <div className="w-full min-h-screen min-w-screen bg-cyan-900 font-mono text-white overflow-x-hidden">
      <Toaster theme="dark" position="top-right" richColors expand={true} toastOptions={{
        style: {
          marginTop: "2rem",
          fontSize: "16px",
        }
      }}
        closeButton />
      <div>
        <nav className="w-full py-3 bg-cyan-950 mb-6 px-4">
          <h1 className="text-3xl">Screenshot Provider</h1>
        </nav>
        <div className="flex px-4 py-4 gap-8">

          <div className="flex max-w-md">
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

              <Input label={'URL:'} value={url} onChange={e => setUrl(e.target.value)} placeholder={'https://example.com'}></Input>

              <div className='flex items-center gap-2'>

                <Input label={'Height:'} type={'number'} value={height} onChange={e => setHeight(e.target.value)}></Input>
                <Input label={'Width:'} type={'number'} value={width} onChange={e => setWidth(e.target.value)}></Input>
                <Input label={'Scale:'} type={'number'} value={scale} onChange={e => setScale(e.target.value)}></Input>
              </div>







              <div className='rounded-lg bg-cyan-800 px-2 py-2 mb-2'>
                <label>
                  <input type="checkbox"
                    checked={fullPage}
                    onChange={e => setFullPage(e.target.checked)}
                    className='accent-amber-300'
                  /> Full Page Screenshot
                </label>
              </div>
              <div className='flex flex-col'>
                <span>Custom Class:</span>
                <textarea name="" id="" className='bg-cyan-800 rounded-lg outline-none p-1' onChange={e => setCustomClass(e.target.value)}></textarea></div>

              <Button type={'submit'}>{loading ? 'Loading...' : 'Get Screenshot'}</Button>


            </form>
            {error && (
              <div className="text-red-700 mt-2 p-4 flex flex-col items-center">
                {error}
              </div>
            )}
          </div>

          <div className="flex-1 flex items-start justify-center gap-4">
            {imgSrc && (
              <>
                <img
                  src={imgSrc}
                  alt="preview"
                  className="mt-5 w-full max-w-lg border object-contain border-gray-400 "
                />

                <Button type={'button'} onClick={copyImageToClipboard}>Copy Image</Button>
                <div className="">File name:
                  <label className='rounded-lg bg-cyan-800 p-2' >
                    <input type="text" value={filename} onChange={e => setFilename(e.target.value)}
                      placeholder='screenshot.png'
                      className='text-white outline-none ml-2' required />

                  </label>
                </div>


                <Button type={'button'} onClick={downloadImageToClipboard}>Download Image</Button>

              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );


}

export default App;
