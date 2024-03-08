import TransformTableData from './transform-table-data';

const rows = [
  {
    name: 'test1',
    link: 'link-1',
    arrayData: ['ad-1', 'ad-2', 'ad-3'],
    arrayDataObj: [{ value: 'ado-1' }, { value: 'ado-2' }, { value: 'ado-3' }]
  },
  {
    name: 'test2',
    link: 'link-2',
    arrayData: ['ad-1'],
    arrayDataObj: [{ value: 'ado-1' }]
  },
  {
    name: 'test3',
    link: 'link-3',
    arrayData: ['ad-1', 'ad-2', 'ad-3'],
    arrayDataObj: [{ value: 'ado-1' }, { value: 'ado-2' }, { value: 'ado-3' }]
  },
  {
    name: 'test4',
    link: 'link-4',
    arrayData: ['ad-1'],
    arrayDataObj: [{ value: 'ado-1' }]
  },
  {
    name: 'test5',
    link: 'link-5',
    arrayData: ['ad-1', 'ad-2', 'ad-3'],
    arrayDataObj: [{ value: 'ado-1' }, { value: 'ado-2' }, { value: 'ado-3' }]
  },
  {
    name: 'test6',
    link: 'link-6',
    arrayData: ['ad-1'],
    arrayDataObj: [{ value: 'ado-1' }]
  }
];

const config = {
  columnConfig: [
    {
      name: '',
      displayType: 'label',
      value: 'name'
    },
    {
      name: '',
      displayType: 'link',
      value: 'link'
    },
    {
      name: '',
      displayType: 'array-label',
      value: 'arrayData'
    },
    {
      name: '',
      displayType: 'array-label',
      value: 'arrayDataObj',
      arrayKey: 'value'
    }
  ]
};

describe('TransformTableData:', () => {
  it('Should be able to call TransformTableData function', async () => {
    const ttd = TransformTableData(rows, config.columnConfig);
    // console.log(ttd);
    expect(ttd).not.toBe(undefined);
  });

  it('Should verify displayType label is displayed as text', async () => {
    const ttd = TransformTableData(rows, config.columnConfig);
    expect(ttd[0].name).toBe('test1');
  });

  it('Should verify displayType link is displayed as link', async () => {
    const ttd = TransformTableData(rows, config.columnConfig);
    expect(typeof ttd[0].link).toBe('object');
  });

  it('Should verify displayType array-label is displayed as array-label', async () => {
    const ttd = TransformTableData(rows, config.columnConfig);
    expect(typeof ttd[0].arrayData).toBe('object');
    expect(typeof ttd[0].arrayDataObj).toBe('object');
    expect(typeof ttd[1].arrayData).toBe('string');
    expect(typeof ttd[1].arrayDataObj).toBe('string');
    expect(ttd[1].arrayData).toBe('ad-1');
    expect(ttd[1].arrayDataObj).toBe('ado-1');
  });
});
