import { useRef, useState, type ChangeEvent } from 'react';

const MAX_INPUT_BYTES = 5_000_000;
const MAX_DIM = { width: 300, height: 375 };
const JPEG_QUALITY = 0.85;

function approxBytesFromDataUrl(dataUrl: string): number {
  const commaIdx = dataUrl.indexOf(',');
  if (commaIdx < 0) return 0;
  const b64 = dataUrl.slice(commaIdx + 1);
  const padding = b64.endsWith('==') ? 2 : b64.endsWith('=') ? 1 : 0;
  return Math.floor((b64.length * 3) / 4) - padding;
}

function drawResized(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('No se pudo leer el archivo'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Imagen inválida o corrupta'));
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = MAX_DIM.width;
        canvas.height = MAX_DIM.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas no soportado'));
          return;
        }
        // Recorte "cover": la imagen LLENA el canvas (se recorta el exceso).
        // Antes se rellenaba con blanco el área sobrante → la foto quedaba dentro
        // de una "card blanca" en el CV. Ahora no queda área vacía.
        const ratio = Math.max(MAX_DIM.width / img.width, MAX_DIM.height / img.height);
        const w = img.width * ratio;
        const h = img.height * ratio;
        const x = (MAX_DIM.width - w) / 2;
        const y = (MAX_DIM.height - h) / 2;
        ctx.drawImage(img, x, y, w, h);
        resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function PhotoUploader({ value, onChange }: { value: string | null; onChange: (v: string | null) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const processFile = async (file: File) => {
    setError(null);
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('El archivo no es una imagen.');
      return;
    }
    if (file.size > MAX_INPUT_BYTES) {
      setError('La imagen es muy grande (máx 5 MB).');
      return;
    }
    try {
      onChange(await drawResized(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo procesar la imagen.');
    }
  };

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) await processFile(file);
  };

  return (
    <div
      className={`photo-uploader ${dragging ? 'photo-uploader--dragging' : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) void processFile(file);
      }}
    >
      <div className="photo-uploader-row">
        <label className="btn-secondary">
          {value ? 'Cambiar foto' : 'Subir foto'}
          <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} hidden />
        </label>
        {value && (
          <>
            <img className="photo-uploader-preview" src={value} alt="Vista previa" />
            <button
              type="button"
              className="btn-link-danger"
              onClick={() => {
                onChange(null);
                if (inputRef.current) inputRef.current.value = '';
              }}
            >
              Quitar
            </button>
          </>
        )}
      </div>
      {!value && (
        <p className="field-help">
          También podés arrastrar y soltar una imagen acá (se recorta y optimiza sola).
        </p>
      )}
      {value && (
        <p className="field-help">
          ~{Math.round(approxBytesFromDataUrl(value) / 1024)} KB · La foto se guarda solo en este navegador.
        </p>
      )}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
