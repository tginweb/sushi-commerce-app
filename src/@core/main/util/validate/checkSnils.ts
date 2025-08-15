export default function checkSnils(value: string) {
  if (!/^\d{3}-\d{3}-\d{3}\s\d{2}$/.test(value)) {
    return false;
  }
  value = value.replace(/\D/g, '');
  const checkSum: number = parseInt(value.slice(9), 10);
  const valueChars = value.substring(0, 9).split('');

  var sum = valueChars.reduce(function (acc: any, next: any, index: number) {
    return acc + next * (9 - index);
  }, 0);
  return (sum < 100 && sum === checkSum)
      || ((sum === 100 || sum === 101) && checkSum === 0)
      || (sum > 101 && (sum % 101 === checkSum || (sum % 101 === 100 && checkSum === 0)));
}
