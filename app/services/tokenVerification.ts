export interface TokenVerificationRequest {
  token: string;
}

export interface TokenVerificationResponse {
  valid: boolean;
  message?: string;
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    const response = await fetch('http://13.228.40.232:6699/3d-map/verify-cross-page-token', {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      console.error('Token verification failed:', response.status);
      return false;
    }

    // Assuming the API returns a success response for valid tokens
    return true;
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
}