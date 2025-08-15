export default function cashMoneyOptions(sumOrder: number) {

    const variantsRound = [
        100,
        500,
        1000,
        2000,
        5000,
    ]

    const resultArray = [];

    for (let i = 0; i < variantsRound.length; i += 1) {
        const roundVariant = variantsRound[i];

        if (roundVariant !== 0) {
            const ost = sumOrder % roundVariant;
            let add = 0;
            if (ost > 0) {
                add = roundVariant - (sumOrder % roundVariant);
            }
            const roundSum = sumOrder + add;

            const searchIndex = resultArray.findIndex((item) => item === roundSum);

            if (searchIndex === -1) {
                resultArray.push(roundSum);
            }
        } else {
            resultArray.push(sumOrder);
        }
    }

    const res = [
        {
            label: '',
            value: null
        },
        {
            label: 'Без сдачи',
            value: 'equal'
        },
        ...resultArray.map(item => ({
            label: item.toString(),
            value: item,
        }))
    ]

    return res
}
