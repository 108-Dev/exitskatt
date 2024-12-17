export const calculatePostEmissionOwnership = (preEmissionOwnership: number): number => {
  return 100 - preEmissionOwnership;
};