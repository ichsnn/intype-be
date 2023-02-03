export const getIdentifier = (identifier: string) => {
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (emailRegex.test(identifier)) return 'email';
  return 'username';
};
