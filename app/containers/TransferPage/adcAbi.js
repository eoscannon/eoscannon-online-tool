const json = [
  {
    "version": "eosio::abi/1.1",
    "structs": [
      {
        "name": "account",
        "base": "",
        "fields": [
          {
            "name": "balance",
            "type": "asset"
          },
          {
            "name": "claimed",
            "type": "bool"
          }
        ]
      },
      {
        "name": "claim",
        "base": "",
        "fields": [
          {
            "name": "owner",
            "type": "name"
          },
          {
            "name": "sym",
            "type": "symbol_code"
          }
        ]
      },
      {
        "name": "close",
        "base": "",
        "fields": [
          {
            "name": "owner",
            "type": "name"
          },
          {
            "name": "symbol",
            "type": "symbol"
          }
        ]
      },
      {
        "name": "create",
        "base": "",
        "fields": [
          {
            "name": "issuer",
            "type": "name"
          },
          {
            "name": "maximum_supply",
            "type": "asset"
          }
        ]
      },
      {
        "name": "currency_stats",
        "base": "",
        "fields": [
          {
            "name": "supply",
            "type": "asset"
          },
          {
            "name": "max_supply",
            "type": "asset"
          },
          {
            "name": "issuer",
            "type": "name"
          }
        ]
      },
      {
        "name": "issue",
        "base": "",
        "fields": [
          {
            "name": "to",
            "type": "name"
          },
          {
            "name": "quantity",
            "type": "asset"
          },
          {
            "name": "memo",
            "type": "string"
          }
        ]
      },
      {
        "name": "open",
        "base": "",
        "fields": [
          {
            "name": "owner",
            "type": "name"
          },
          {
            "name": "symbol",
            "type": "symbol"
          },
          {
            "name": "ram_payer",
            "type": "name"
          }
        ]
      },
      {
        "name": "recover",
        "base": "",
        "fields": [
          {
            "name": "owner",
            "type": "name"
          },
          {
            "name": "sym",
            "type": "symbol_code"
          }
        ]
      },
      {
        "name": "retire",
        "base": "",
        "fields": [
          {
            "name": "quantity",
            "type": "asset"
          },
          {
            "name": "memo",
            "type": "string"
          }
        ]
      },
      {
        "name": "team_vesting",
        "base": "",
        "fields": [
          {
            "name": "account",
            "type": "name"
          },
          {
            "name": "issued",
            "type": "asset"
          }
        ]
      },
      {
        "name": "transfer",
        "base": "",
        "fields": [
          {
            "name": "from",
            "type": "name"
          },
          {
            "name": "to",
            "type": "name"
          },
          {
            "name": "quantity",
            "type": "asset"
          },
          {
            "name": "memo",
            "type": "string"
          }
        ]
      },
      {
        "name": "update",
        "base": "",
        "fields": [
          {
            "name": "issuer",
            "type": "name"
          },
          {
            "name": "maximum_supply",
            "type": "asset"
          }
        ]
      }
    ],
    "actions": [
      {
        "name": "claim",
        "type": "claim",
        "ricardian_contract": ""
      },
      {
        "name": "close",
        "type": "close",
        "ricardian_contract": ""
      },
      {
        "name": "create",
        "type": "create",
        "ricardian_contract": ""
      },
      {
        "name": "issue",
        "type": "issue",
        "ricardian_contract": ""
      },
      {
        "name": "open",
        "type": "open",
        "ricardian_contract": ""
      },
      {
        "name": "recover",
        "type": "recover",
        "ricardian_contract": ""
      },
      {
        "name": "retire",
        "type": "retire",
        "ricardian_contract": ""
      },
      {
        "name": "transfer",
        "type": "transfer",
        "ricardian_contract": ""
      },
      {
        "name": "update",
        "type": "update",
        "ricardian_contract": ""
      }
    ],
    "tables": [
      {
        "name": "accounts",
        "index_type": "i64",
        "type": "account"
      },
      {
        "name": "stat",
        "index_type": "i64",
        "type": "currency_stats"
      },
      {
        "name": "teamvest",
        "index_type": "i64",
        "type": "team_vesting"
      }
    ]
  }
]

export default json
