
export async function sendOTP(mobileNumber: string, otp: string) {
  console.log(`[MOCK SMS] Sending OTP ${otp} to ${mobileNumber}`);
  return { success: true, error: null };
}
