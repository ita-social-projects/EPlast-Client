const getOnlyNums = (text: string) => {
    return text.replace(/\D/g, "");
  };

export default getOnlyNums;