export class TokenUtil {
  public static extractToken(authorization: string): string {
    return authorization?.split(' ')[1];
  }
}
