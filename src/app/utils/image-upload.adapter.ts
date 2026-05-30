import { environment } from '../../environments/environment';

const UPLOAD_URL =
  environment.apiBaseUrl.replace(/\/+$/, '') + '/api/post/uploadImage';

// Maximum allowed image size (5 MB). Must match the API limit.
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/**
 * CKEditor upload adapter that sends the selected image to the API,
 * which stores it on the server and returns its public URL. The editor
 * then references the image by URL instead of embedding base64 in the
 * post content.
 */
export class ServerImageUploadAdapter {
  private loader: any;
  private xhr: XMLHttpRequest | null = null;

  constructor(loader: any) {
    this.loader = loader;
  }

  upload(): Promise<any> {
    return this.loader.file.then(
      (file: File) =>
        new Promise((resolve, reject) => {
          if (file.size > MAX_IMAGE_BYTES) {
            return reject('Image must be 5 MB or smaller.');
          }

          const xhr = new XMLHttpRequest();
          this.xhr = xhr;

          xhr.open('POST', UPLOAD_URL, true);
          xhr.responseType = 'json';

          xhr.addEventListener('error', () => {
            console.error(`Image upload failed (network/CORS) for ${file.name}. URL: ${UPLOAD_URL}`);
            reject(`Couldn't upload file: ${file.name}. Check that the API is running.`);
          });
          xhr.addEventListener('abort', () => reject());

          xhr.addEventListener('load', () => {
            const response = xhr.response;

            if (xhr.status < 200 || xhr.status >= 300 || !response?.url) {
              console.error(
                `Image upload failed for ${file.name}: HTTP ${xhr.status}`,
                response
              );
              return reject(
                response?.error ||
                  `Couldn't upload file: ${file.name}. (HTTP ${xhr.status})`
              );
            }

            // CKEditor expects { default: <url> }
            resolve({ default: response.url });
          });

          // Report progress to the editor's upload UI when available.
          if (xhr.upload) {
            xhr.upload.addEventListener('progress', (evt) => {
              if (evt.lengthComputable) {
                this.loader.uploadTotal = evt.total;
                this.loader.uploaded = evt.loaded;
              }
            });
          }

          const data = new FormData();
          data.append('file', file);
          xhr.send(data);
        })
    );
  }

  abort(): void {
    if (this.xhr) {
      this.xhr.abort();
    }
  }
}

export function ServerImageUploadPlugin(editor: any): void {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) =>
    new ServerImageUploadAdapter(loader);
}
