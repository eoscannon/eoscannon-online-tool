const json = [
  {
    version: 'eosio::abi/1.0',
    types: [
      {
        new_type_name: 'account_name',
        type: 'name'
      }
    ],
    structs: [
      {
        name: 'transfer',
        base: '',
        fields: [
          {
            name: 'from',
            type: 'account_name'
          },
          {
            name: 'to',
            type: 'account_name'
          },
          {
            name: 'quantity',
            type: 'asset'
          },
          {
            name: 'memo',
            type: 'string'
          }
        ]
      },
      {
        name: 'create',
        base: '',
        fields: [
          {
            name: 'issuer',
            type: 'account_name'
          },
          {
            name: 'maximum_supply',
            type: 'asset'
          }
        ]
      },
      {
        name: 'issue',
        base: '',
        fields: [
          {
            name: 'to',
            type: 'account_name'
          },
          {
            name: 'quantity',
            type: 'asset'
          },
          {
            name: 'memo',
            type: 'string'
          }
        ]
      },
      {
        name: 'brainmeiq',
        base: '',
        fields: [
          {
            name: 'staker',
            type: 'account_name'
          },
          {
            name: 'amount',
            type: 'int64'
          }
        ]
      },
      {
        name: 'account',
        base: '',
        fields: [
          {
            name: 'balance',
            type: 'asset'
          }
        ]
      },
      {
        name: 'currency_stats',
        base: '',
        fields: [
          {
            name: 'supply',
            type: 'asset'
          },
          {
            name: 'max_supply',
            type: 'asset'
          },
          {
            name: 'issuer',
            type: 'account_name'
          }
        ]
      }
    ],
    actions: [
      {
        name: 'transfer',
        type: 'transfer',
        ricardian_contract: ''
      },
      {
        name: 'issue',
        type: 'issue',
        ricardian_contract: ''
      },
      {
        name: 'brainmeiq',
        type: 'brainmeiq',
        ricardian_contract: ''
      },
      {
        name: 'create',
        type: 'create',
        ricardian_contract: ''
      }
    ],
    tables: [
      {
        name: 'accounts',
        index_type: 'i64',
        key_names: ['currency'],
        key_types: ['uint64'],
        type: 'account'
      },
      {
        name: 'stat',
        index_type: 'i64',
        key_names: ['currency'],
        key_types: ['uint64'],
        type: 'currency_stats'
      }
    ],
    error_messages: [],
    abi_extensions: []
  }
]

export default json
