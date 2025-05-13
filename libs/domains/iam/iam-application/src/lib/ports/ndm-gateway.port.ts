export interface INdmServiceGateway {
  sendVerificationEmail(
    userId: string,
    email: string,
    firstName: string,
    verificationToken: string,
    locale: string,
  ): Promise<void>; // Could return IGenericResult if NDM call can have business failures

  sendPasswordResetEmail(
    userId: string,
    email: string,
    firstName: string,
    resetToken: string,
    locale: string,
  ): Promise<void>;

  // sendInvitationEmail(...): Promise<void>;
}

export const INdmServiceGateway = Symbol('INdmServiceGateway');
