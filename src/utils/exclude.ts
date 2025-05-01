const exclude = <Type, Key extends keyof Type>(obj: Type, keys: Key[]): Omit<Type, Key> => {
  const clone = { ...obj };
  for (const key of keys) {
    delete clone[key];
  }
  return clone; // Cambiado para devolver el objeto modificado
};

export default exclude;
