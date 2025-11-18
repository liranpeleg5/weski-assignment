const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export interface Hotel {
  id: string;
  name: string;
  price: number;
  beds?: number;
  imageUrl?: string;
  rating?: number;
}

export interface SearchParams {
  resortId: number;
  groupSize: number;
  startDate: string;
  endDate: string;
}

export function searchHotelsProgressive(
  params: SearchParams,
  onUpdate: (hotels: Hotel[]) => void
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    fetch(`${API_BASE_URL}/hotels/progressive`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text().catch(() => 'Unknown error');
          throw new Error(`Failed to start progressive search: ${response.status} ${errorText}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error('No response body');
        }

        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              try {
                const parsed = JSON.parse(data);
                if (parsed.error) {
                  reject(new Error(parsed.error));
                  return;
                }
                if (parsed.done) {
                  resolve();
                  return;
                }
                if (parsed.hotels) {
                  onUpdate(parsed.hotels);
                }
              } catch (e) {
                // Skip malformed data
              }
            }
          }
        }

        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}

