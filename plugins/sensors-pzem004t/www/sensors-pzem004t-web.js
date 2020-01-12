sensorsTypes.add( 'PZEM004T', {
    voltage: {
        title: 'Напря\u00ADжение, В',
        align: 'right',
        data: (sd) => Number(sd.param('voltage') / 10).toFixed(0)
    },
    current: {
        title: 'Ток, А',
        align: 'right',
        data: (sd) => Number(sd.param('current') / 100).toFixed(1)
    },
    power: {
        title: 'Мощ\u00ADность, Вт',
        align: 'right',
        data: (sd) => Number(sd.param('power'))
    },
    energy: {
        title: 'Энергия, кВт*ч',
        align: 'right',
        data: (sd) => Number(sd.param('energy') / 1000).toFixed(1)
    },
    energyT1: {
        title: 'Энергия Т1, кВт*ч',
        align: 'right',
        data: (sd) => Number(sd.param('energy-t1') / 1000).toFixed(0)
    },
    energyT2: {
        title: 'Энергия Т2, кВт*ч',
        align: 'right',
        data: (sd) => Number(sd.param('energy-t2') / 1000).toFixed(0)
    },
    dataAge:{
        title: 'Сек. назад',
        align: 'right',
        data: (sd) => sd.dataAge()
    }
});
