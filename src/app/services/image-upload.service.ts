import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

/**
 * The featured image on a post or an equipment guide: one fixed size, checked
 * before it is sent, stored server-side and referenced by URL.
 *
 * Shared by both admin editors so the rule lives in one place — a post and a
 * guide cannot end up accepting different sizes.
 *
 * The image is not embedded in the record: a 1200x630 image inlined as base64
 * would inflate every list response that carries the row, which is the
 * opposite of loading quickly.
 */
@Injectable({ providedIn: 'root' })
export class ImageUploadService {

  /** Exactly this size — what social platforms crop link previews to. */
  readonly width = 1200;
  readonly height = 630;

  /** Matches the API limit the CKEditor adapter also enforces. */
  private readonly maxBytes = 5 * 1024 * 1024;

  /** The generic image store; equipment has no endpoint of its own. */
  private readonly url =
    environment.apiBaseUrl.replace(/\/+$/, '') + '/api/post/uploadImage';

  constructor(private http: HttpClient) { }

  /**
   * Checks a chosen file before it is uploaded.
   *
   * Resolves to null when the file is usable, otherwise to the reason it is
   * not — phrased for the editor to read, naming the size they actually picked
   * rather than only the size required.
   */
  validate(file: File): Promise<string | null> {
    if (file.size > this.maxBytes) {
      return Promise.resolve('Image must be 5 MB or smaller.');
    }

    return new Promise(resolve => {
      const objectUrl = URL.createObjectURL(file);
      const img = new Image();

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);

        if (img.width === this.width && img.height === this.height) {
          resolve(null);
          return;
        }

        resolve(
          `Image must be exactly ${this.width} x ${this.height} pixels. ` +
          `This one is ${img.width} x ${img.height}.`
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve('That file could not be read as an image.');
      };

      img.src = objectUrl;
    });
  }

  /** Stores the image and returns its public URL. */
  upload(file: File) {
    const data = new FormData();
    data.append('file', file);
    return this.http.post<{ url: string }>(this.url, data);
  }
}
