import { TransactionReceipt } from 'ox'
import { expect, test } from 'vitest'

test('default', () => {
  const receipt = TransactionReceipt.toRpc({
    blobGasPrice: 270441n,
    blobGasUsed: 4919n,
    blockHash:
      '0xc350d807505fb835650f0013632c5515592987ba169bbc6626d9fc54d91f0f0b',
    blockNumber: 19868015n,
    contractAddress: null,
    cumulativeGasUsed: 533781n,
    effectiveGasPrice: 9062804489n,
    from: '0x814e5e0e31016b9a7f138c76b7e7b2bb5c1ab6a6',
    gasUsed: 175034n,
    logs: [],
    logsBloom:
      '0x00200000000000000000008080000000000000000040000000000000000000000000000000000000000000000000000022000000080000000000000000000000000000080000000000000008000000200000000000000000000200008020400000000000000000280000000000100000000000000000000000000010000000000000000000020000000000000020000000000001000000080000004000000000000000000000000000000000000000000000400000000000001000000000000000000002000000000000000020000000000000000000001000000000000000000000200000000000000000000000000000001000000000c00000000000000000',
    root: undefined,
    status: 'success',
    to: '0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad',
    transactionHash:
      '0x353fdfc38a2f26115daadee9f5b8392ce62b84f410957967e2ed56b35338cdd0',
    transactionIndex: 2,
    type: 'eip1559',
  })
  expect(receipt).toMatchInlineSnapshot(`
    {
      "blobGasPrice": "0x042069",
      "blobGasUsed": "0x1337",
      "blockHash": "0xc350d807505fb835650f0013632c5515592987ba169bbc6626d9fc54d91f0f0b",
      "blockNumber": "0x012f296f",
      "contractAddress": null,
      "cumulativeGasUsed": "0x082515",
      "effectiveGasPrice": "0x021c2f6c09",
      "from": "0x814e5e0e31016b9a7f138c76b7e7b2bb5c1ab6a6",
      "gasUsed": "0x02abba",
      "logs": [],
      "logsBloom": "0x00200000000000000000008080000000000000000040000000000000000000000000000000000000000000000000000022000000080000000000000000000000000000080000000000000008000000200000000000000000000200008020400000000000000000280000000000100000000000000000000000000010000000000000000000020000000000000020000000000001000000080000004000000000000000000000000000000000000000000000400000000000001000000000000000000002000000000000000020000000000000000000001000000000000000000000200000000000000000000000000000001000000000c00000000000000000",
      "root": undefined,
      "status": "0x1",
      "to": "0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad",
      "transactionHash": "0x353fdfc38a2f26115daadee9f5b8392ce62b84f410957967e2ed56b35338cdd0",
      "transactionIndex": "0x02",
      "type": "eip1559",
    }
  `)
})

test('behavior: nullish values', () => {
  const receipt = TransactionReceipt.toRpc({
    blobGasPrice: undefined,
    blobGasUsed: undefined,
    blockHash:
      '0xc350d807505fb835650f0013632c5515592987ba169bbc6626d9fc54d91f0f0b',
    blockNumber: 0n,
    contractAddress: null,
    cumulativeGasUsed: 0n,
    effectiveGasPrice: 0n,
    from: '0x814e5e0e31016b9a7f138c76b7e7b2bb5c1ab6a6',
    gasUsed: 0n,
    logs: [
      {
        address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        blockHash:
          '0xc350d807505fb835650f0013632c5515592987ba169bbc6626d9fc54d91f0f0b',
        blockNumber: 19868015n,
        data: '0x00000000000000000000000000000000000000000000000009b6e64a8ec60000',
        logIndex: 17,
        removed: false,
        topics: [
          '0xe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c',
          '0x0000000000000000000000003fc91a3afd70395cd496c647d5a6cc9d4b2b7fad',
        ],
        transactionHash:
          '0x353fdfc38a2f26115daadee9f5b8392ce62b84f410957967e2ed56b35338cdd0',
        transactionIndex: 2,
      },
    ],
    logsBloom:
      '0x00200000000000000000008080000000000000000040000000000000000000000000000000000000000000000000000022000000080000000000000000000000000000080000000000000008000000200000000000000000000200008020400000000000000000280000000000100000000000000000000000000010000000000000000000020000000000000020000000000001000000080000004000000000000000000000000000000000000000000000400000000000001000000000000000000002000000000000000020000000000000000000001000000000000000000000200000000000000000000000000000001000000000c00000000000000000',
    root: undefined,
    status: 'success',
    to: '0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad',
    transactionHash:
      '0x353fdfc38a2f26115daadee9f5b8392ce62b84f410957967e2ed56b35338cdd0',
    transactionIndex: 0,
    type: '0x69',
  })
  expect(receipt).toMatchInlineSnapshot(`
    {
      "blobGasPrice": undefined,
      "blobGasUsed": undefined,
      "blockHash": "0xc350d807505fb835650f0013632c5515592987ba169bbc6626d9fc54d91f0f0b",
      "blockNumber": "0x00",
      "contractAddress": null,
      "cumulativeGasUsed": "0x00",
      "effectiveGasPrice": "0x00",
      "from": "0x814e5e0e31016b9a7f138c76b7e7b2bb5c1ab6a6",
      "gasUsed": "0x00",
      "logs": [
        {
          "address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
          "blockHash": "0xc350d807505fb835650f0013632c5515592987ba169bbc6626d9fc54d91f0f0b",
          "blockNumber": "0x012f296f",
          "data": "0x00000000000000000000000000000000000000000000000009b6e64a8ec60000",
          "logIndex": "0x11",
          "removed": false,
          "topics": [
            "0xe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c",
            "0x0000000000000000000000003fc91a3afd70395cd496c647d5a6cc9d4b2b7fad",
          ],
          "transactionHash": "0x353fdfc38a2f26115daadee9f5b8392ce62b84f410957967e2ed56b35338cdd0",
          "transactionIndex": "0x02",
        },
      ],
      "logsBloom": "0x00200000000000000000008080000000000000000040000000000000000000000000000000000000000000000000000022000000080000000000000000000000000000080000000000000008000000200000000000000000000200008020400000000000000000280000000000100000000000000000000000000010000000000000000000020000000000000020000000000001000000080000004000000000000000000000000000000000000000000000400000000000001000000000000000000002000000000000000020000000000000000000001000000000000000000000200000000000000000000000000000001000000000c00000000000000000",
      "root": undefined,
      "status": "0x1",
      "to": "0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad",
      "transactionHash": "0x353fdfc38a2f26115daadee9f5b8392ce62b84f410957967e2ed56b35338cdd0",
      "transactionIndex": "0x00",
      "type": "0x69",
    }
  `)
})
