import bigdecimal from 'bigdecimal'
import _, { sample, get } from 'lodash'
import QueryString from 'querystring'
import converter from 'hex2dec'
import blake from 'blakejs'
import { concat } from '@ethersproject/bytes'
import { mapLimit } from 'async'
import axios from 'axios'
import moment from 'moment'

interface IToken {
    address: string
    chain: string
    decimal: string
}

const chainType: Record<string, string> = {
    kavaEvm: "kavaEvm",
    confluxEvm: "confluxEvm",
    xaiNetwork: "xaiNetwork",
    chiliz: "chiliz",
    mantle: "mantle",
    zkSyncEra: "zkSyncEra",
    zkSyncPolygon: "zkSyncPolygon",
    baseTest: "baseTest",
    ether: "ether",
    binanceSmart: "binanceSmart",
    heco: "heco",
    tomo: "tomo",
    avax: "avax",
    matic: "matic",
    fantom: "fantom",
    arbitrum: "arbitrum",
    arbitrumXdai: "arbitrumXdai",
    celo: "celo",
    optimism: "optimism",
    xDai: "xDai",
    boba: "boba",
    aurora: "aurora",
    cronos: "cronos",
    bittorrent: "bittorrent",
    moonbeam: "moonbeam",
    97: "97",
    11155111: "11155111",
    linea: "linea",
    kroma: "kroma",
    ancient8: "ancient8",
    ancient8Testnet: "ancient8Testnet",
    casper:"casper", functionX:"functionX", kucoin:"kucoin", bitcoin:"bitcoin", binance:"binance", near:"near",
    polkadot:"polkadot", avaxX:"avaxX", kusama:"kusama", tron:"tron",
    thor:"thor", cosmos:"cosmos", terra:"terra", band:"band", kava:"kava", persistence:"persistence",
    kardia:"kardia",
    elrond:"elrond", helimum:"helimum", omg:"omg", dogecoin:"dogecoin", ronin:"ronin", okex:"okex",
    klaytn:"klaytn", secretNetwork:"secretNetwork",
    theta:"theta", thetaFuel:"thetaFuel", ton:"ton", platon:"platon",
    zkFair: 'zkFair',
    omni: 'omni',
    orderly: 'orderly',
    skate: 'skate',
    wanchain: 'wanchain',
    coreDao: 'coreDao'
}

export const LINK_EXPLORER_API = {
    [chainType.kavaEvm]: 'https://kavascan.com/api?',
    [chainType.confluxEvm]: 'https://evmapi.confluxscan.io/api?',
    [chainType.xaiNetwork]: 'https://explorer.xai-chain.net/api?',
    [chainType.chiliz]: 'https://scan.chiliz.com/api?',
    [chainType.mantle]: 'https://explorer.mantle.xyz/api?',
    [chainType.zkSyncEra]: 'https://zksync2-mainnet.zkscan.io/api?',
    [chainType.zkSyncPolygon]: 'https://api-zkevm.polygonscan.com/api?',
    [chainType.baseTest]: 'https://api-goerli.basescan.org/api?',
    [chainType.ether]: 'https://api.etherscan.io/api?',
    [chainType.binanceSmart]: 'https://api.bscscan.com/api?',
    [chainType.heco]: 'https://api.hecoinfo.com/api?',
    [chainType.tomo]: 'https://tomoscan.io/api/',
    [chainType.avax]: 'https://api.snowtrace.io/api?',
    [chainType.matic]: 'https://api.polygonscan.com/api?',
    [chainType.fantom]: 'https://api.ftmscan.com/api?',
    [chainType.arbitrum]: 'https://api.arbiscan.io/api?',
    [chainType.arbitrumXdai]: 'https://blockscout.com/xdai/aox/api?',
    [chainType.celo]: 'https://explorer.celo.org/api?',
    [chainType.optimism]: 'https://api-optimistic.etherscan.io/api?',
    [chainType.xDai]: 'https://blockscout.com/xdai/mainnet/api?',
    [chainType.boba]: 'https://api.bobascan.com/api?',
    [chainType.aurora]: 'https://explorer.mainnet.aurora.dev/api?',
    [chainType.cronos]: 'https://api.cronoscan.com/api?',
    [chainType.bittorrent]: 'https://api.bttcscan.com/api?',
    [chainType.moonbeam]: 'https://api-moonbeam.moonscan.io/api?',
    97: 'https://api-testnet.bscscan.com/api?',
    11155111: 'https://api-sepolia.etherscan.io/api?',
    [chainType.linea]: 'https://api.lineascan.build/api?',
    [chainType.kroma]: 'https://api.kromascan.com/api?',

    // [chainType.zkFair]: 'https://scan.zkfair.io/api?',
    // [chainType.omni]: 'https://explorer.mainnet.aurora.dev/api?',
    [chainType.orderly]: 'https://explorer.orderly.network/api?',
    [chainType.skate]: 'https://nolliescan.skatechain.org/api?',
    // [chainType.wanchain]: 'https://api-moonbeam.moonscan.io/api?',
    [chainType.coreDao]: 'https://openapi.coredao.org/api?'
}
export const KEY_EXPLORER_API = {
    [chainType.coreDao]:[
        '4f43ca5bfea34910b56857ae28ed9a8a'
    ],
    [chainType.cronos]: [
        '3SWGXP1JG3N1GGG31GT662BSFFURT3QF8R',
        'TRW171U8SQYV75WMBNDF3SF4JR63EP1INF',
        '18QGESD414P9QWIQH4PUS9SMVPMBQC46K9',
        'QBGXNZVFQY2NQBTCNBHBHJAKKUZUK67H7J',
        'YNR5UYWC1CRRQQH1IDX89EC5J1Y2RW69I5',
        '6NXYF1C51VP3VPZ83HYRTRATDF2BD6QFIR',
        '7TMC6QXF8RVIJ9G3KKEZ76BFIYGR8I9ZI2',
        'FUMG3UBAR6YIV53EXI7Y89H7X5CJ28XYZU',
        '8F21KS4JR2IY9MM9T9I9QYXU3FEIHI5KYF',
        '8R6ME11AZ13YTA8S5BUZI382DMKWUD7D8Y',
        'VJ9QAHQNYXCI64S8S49KTUC7BPXUTKRYA7',
        'SAKTMAWTH62VI5AECPIQYXYEGYD1ZXF3KB'
    ],
    [chainType.boba]: [
        'PQFCHSIMJFPSHPNIYS3ZTNUBJY2S5JHV9N',
        'DZMN5QNJ86PDX9UKDDSW3R5A46PVFPNT5A',
        'IRP9KMDJZUN153P21NH67TKD5EYG5B6WWW',
        'FA2Y3VU3PGTIKY2JUZXFM8IRZ45EAMDSSD',
        '7UIEK4M3SPIWM4E8NRBXTYASFGZ8S6AS49',
        'DF5TP2NJM11GPM4KDN1G6F5CD83FSGQ8DF',
        'UPTARRQ9PS4M84NPGY8RJIVM3MDBFJ43UE',
        'Y888HPZITFQ65NQU6SAA3FCK6WBP38BNBQ',
        'YIEY832KU26CDTX1I8FPTH7TSCRDHMQI2N',
        'ZQY1NMDKIKB7V8AQMYKRTE8X38BWTAE94P',
        'Y214IQMGPPTQ217IUMTDKIU32BDSND9JKD',
        'S48Y9M9XUWYQSXSY56B138A5XY8H9FKE4E'
    ],
    [chainType.okex]: [
        '5796d6d5-00fd-4f68-9b11-48060aad2cd1',
        '0b218cbb-653c-4a30-80ac-d0a7844e9832',
        '6efeb6b5-2a73-45df-8254-91e2cea97255',
        '2dbc3c2d-b25a-41df-aeac-e11e8e4d42bc',
        '730733b8-96ee-4c6b-8cf1-42b63b80e12e',
        '7f45f36d-795b-404d-b1af-de5dd7b7928d',
        'e373145f-1d78-4e24-9013-fb78f40eed6d',
        'bf145e32-4205-4ccc-98a9-e500baf6de65',
        '210c937f-1565-4816-94e1-4119f5087077',
        'a6ae9f67-b312-428f-8ac2-9bfb3cca3ab6'
    ],
    [chainType.arbitrum]: [
        '9RKTNCXGQYBUKBY6M25H15RQNHKZ81E4Y9',
        'BVP6RG7KNHXDX1QVFN76W66ZI9V8CN4UEP',
        'IM8RS8WDPU63JJN9ZDU52DF98ICN22QBPW',
        'BN3T8XMCXJHWDFM7AHKKK5T25JSS1Q542K',
        '4A1GSZE1TI667PW3KUXU4ZGYB87NZ4E25K',
        'QJMCTB59YRJJ9EX3A1X1CR3N1K4G9WCHFP',
        '6JQ688AGFVSM7SFDH53QP14DPNBDNBWIAK',
        'M8WI3RT8QUBGE213PK4ZGM5GWEFEKDZT6T',
        'SWJZ19W1JPZVYTTKQBY4Q5Q44MUGF6Q6Q5',
        'K6QJH4ZDEPCH2C9WVV5F18PRWUGFDTFD78',
        'P14UVVAYMYBR319DNZ56WGCDZ3FWJUIYJU',
        'HZ286SDTCE97Q97UDEZAC1NP94CI9IWAMV'
    ],
    [chainType.avax]: [
        '77U43KXBW7JVF17W3T6PGEA112JPGBTC4I',
        'FVFM1DB3H4WA4ZF99UU232KFKYTMK6AH6J',
        'EVWSHTARHXHV4N3AQ4Z8DDAE7I1N5BM1QI',
        'CFXWR1EZGBSGYYWWM58UIIX8SN2IPPJY82',
        '5JMZF9D2ZJISEHA93RMZ4MMD7S7UDBZJIC',
        '3HPG5NZH1WFDZGZIW69T2GWA9CG55QWWUM',
        '5IFMBB8WB9F2IY57RYB6PCPVVSKKKCXCFJ',
        'BTYFX4SYGXSKA17TTI1A8Y53J6H7C51E6R',
        'SB98ZGHCPGRMNGCE29EZTT77NUYB1JGBFX',
        'IB6EQKQ53TFG7WJB2D55VBAIXSS6CU24ET',
        'VZYU1HMKVNCF813VFYE9BJPFV8RF92M92E',
        'H58UPM2GIYSFNEB48Q4BRYFTXFVM7HBIE8'
    ],
    [chainType.celo]: [
        'SKM3SRFZ3UYV6R2R6EWAK3BF1J96MC6KUD',
        'WGCQ5VM65H7F2XY3CPDTST6XQKNGITCKMP',
        '1H32TAFCAEUQ2M3YTXN268C5C7NZTH393C',
        '22W5QWN5MS7EYUD7H8HV819AN98EX55TVV',
        'CK4H63M1IEZSH9856JF3PBBUUVW84EA7WM',
        'GH11CYTF235TIDMZMVY965676G3KCNTYYV',
        'AJVS2G8Y5M5BFUUFJ4ITZ1JYKV89H464E3',
        'ZPPQ5H4Z7QXGDNSER74GHY4Q589UH3IU3B',
        'AFRY2SFBDUGBTA9JH6YCXCC2TTHMUABN9H',
        'SPGSDIWGNZ6RKKKINCI41QE8S7BQCFJYRR',
        'IBJSQUGTETD68IYER93RKUXB1HHRGZ8EEG',
        'VQWXBM9EDU1A4BZ1J3CBA3TIVT4IYEKMWM'
    ],
    [chainType.kucoin]: [
        'eBa7KU4UqBpGo0PU6x82',
        'Dx4FU2k1UwMesmrd652U',
        'FL4qONNc6yZNLPYWdHbL',
        'lFUXCTT77SCMdwmISLeO',
        '76d3Na7ttZuROIENA0Xp',
        'Sw26mj4mVvBnQ3Fv0ZOs',
        'ZqUhJFOMc1cdlZxqzRaO',
        'B34C0CvuAY4CtsIyhPMF',
        'CuGJoeog6JvV5J3NzRkl',
        'ZWKzfM5qgVyp3p7Vm4Q3',
        'EgmIOpflE87HaplLbs6d',
        'dK2JdwGlZNECLJEExdYD'
    ],
    [chainType.ether]:
        [
            '8Y8J2T7IQTE8Q7XDSTJVZMAB1I1AUQVAW7',
            '8XR2UB6B1W3KPPCR7S8WHKMF2AAWHBYTRH',
            '21HTR85ZVJ8NXHHAYAEP3P58PTMC8DCAXW',
            'CSGZKJYGN9C2N5X4SVIU8B39CQ72P61399',
            'GASTRGVU4MMV87ADAZ8BQYF69B456XQ2AM',
            '8JVPMDXBA9ZCZ9CQ4U6FYA4QEB9S5CIX2D',
            'NHM4MF9MAR9JQN1H1FCRVUEN62FQJEWC64',
            'RYCVDN7X2X24667KHDN13XJPQC7GDM2QY3',
            '3DWQ18R7K16CAMNWF6SST7JNKHESGM971E',
            'U2FABIPYUVCVEQYXE3VS8B5N48E2N261T5',
            'UM4F4C4FJQF7W9MVY5UT54XX4WKN1YVERJ',
            'DUCG6D25NKHP6SQBGE9KP9XEDBTD5PQ4XK',
            'SIJ6R8RMMJBC5P42MYH516I79PPENCS98I',
            '8NCJPDT5YIAX2YB5P9YPPQ9D5ERQ2VSRDV',
            '2PFSAZFHVG78QBNMY57GYBR713XBWYMSC1',
            'YUQ2AFG3X1MYNTEWD61ZNAGBWNQK49SJF3',
            'B3YB1AIMA31NIY6U8N4AFTD9I5VCVPHVDM',
            'MHPEQ83PUG8BHXXS2T5URNY3XCRDZBUETG'
        ],
    [chainType.binanceSmart]:
        [
            'R2HX94UAXT5RV8685VNH9WRPFZXE1T7E5R',
            'VIKNUINVK8AJ58JCPIZZ632EVMIQ8MRG76',
            'GKYZ2SYS5DJCZJ31BC87JKSXRAK88USMUI',
            'XF9GEBA369W62CT946TNPR4AU2VUEBB2N6',
            'GHV4AR7NRGK134D1CRUREZQIK4BQB2RE39',
            'Q7XT33FJ2JI5XTJ2TGATCF3X5IH89IWSXC',
            'KAMJ8I8JIS5BN6CB262G6RGXQ19P4WYZ93',
            'ZWQMMSQU3MHZWINV3CDNC7WBJXP666T283',
            'Z6R7NKMA7IRYKMNRC7EBGRSX27Q736PPE3',
            'AQDMSZQIKF5Z7S65HH1DA5S4U84JBQ5JEN',
            '56M6P9NRNUY9958Y5TJ1C1B82HBRFG3515',
            'W3JH7B318RDH6SBK9ASR3N8U86YW7ISISI',
            'RRJ92XSC8JQR8T8VSRA199GD1CHPY7AC7D',
            'HK4JMVM891SNUJB4H9M186CXDNCGKCPWMJ',
            'K6XJEHK228D41ETK7V6WRGM2BXUI6WAX9G',
            'CUKZXSHUENDYUQ5HGUAWNZTYXKVVBY5Y7Q',
            '7X3YN2RIVU235Q15N2PGH3K8SD9TK19MJQ',
            'PCVXVB9GCFXFNF3MEXW6CF818E853CTZ1G',
            '1ZW6IYSHKGKP7QQCUMNUSJP2K948ZDPZ46',
            '12TKEJTCPHARAWY6GGPFZZ57GAJS58BSRM',
            '5IQTN54DY8APM8M7JCE19P198CN9GWG4UI',
            'AK43TN2Y2MQH3KTU2HNXVJ24KQKN84ZJYH',
            '8MKGIJI3GIXFX6RNVZEXGJ6WF11GZ9JUVM',
            'YYGXY3D3YJKAZUDXMY784U5NY38M4HCN5S',
            '9HNCYTBBFGKWQZX58887WZMHTUEXBWWFQK',
            '52DNJ591C29Z4QUPZHZU563Y9JDCEPFAWD',
            '1PSKHC1X7JXG4XZQ6VTW9TAQIM12AWVUW6',
            '5G7VQ81RH9GF78K4SM1X5DNPIGKD95T31Y',
            'URMB3PCRRY933FFRQAQH2KSHHRF7EBS55B',
            '4UDJTU2SA8VZN7TZEF9UPISBTSNWJAS453',
            'S6W22TIIW34CK9HGH78FQDCMPSZMGQU7Q1',
            'YEFZ8G3CV29775AMZQAUBF6Q19VSVB397W',
            'PZDDVS68786AN2J6ZS7BYQ44FY4UGJVRAN',
            'UEKUFS8FV7NAGE5R9TX3WIKFHYWDBR9ZKP',
            'G7QVBKFNPJC1NY4YCBBZKMEQCDYW3RYZCB',
            'KTYM18Z7VU4SRFKR5KYJ9QCKBJV1FCQYMQ',
            '72VB6J1XQKYMADMU5DZ8JQXDZSVJAP6Z8J',
            'AI348ATR3YM7BV5YK7TICCWQQFA88JSJAZ',
            '4U4EWS9XH1QH7CKK2512NGEGDHDJDV373G',
            'BRGGEMWJ3GS85UKM3VYDTY64TPC5DMYEQB',
            '8V342G3USUSJDDXNVZRP7C7JZEKG5RUD6B',
            '7FCUEZWJ83P6ZSBRN656VNUHY5V8BG2GIA',
            '2NICU1R4NSSIC2Q9EIVVIMTJITI3RGID7M',
            'D6BN65K1RIR4MG45PTY6EGS95PHXTT432D',
            'BBUXN687TPKWC2WY43YRF16FKMDHIIX5BQ',
            'RMRUPC253T4XS3HTDMPYUXJCS6K7E8M9RC',
            'MEYMTSJU69I2NC3NN9MEIV4I8GFMXCEPHK',
            'VR34NX6XK18WNCAJ2H5DG1MIW6HJZ9KJC3',
            '79RC67QYEAXJR4UNVKK4T1QPXA357GYKR5',
            '7MVJQ872SB7V9ZXFP85INTIENIUUIUFWR2',
            '18FNVP2X2KPWJ8YK1N9CIIX6V92GMQKPQV',
            'NVBN8JG92BG34KW3JXI7H9VHGHKBA44ST4',
            'WGRU1YINPN7VD1N74H1CG514AFQKSPX8TK',
            '1JVZGJ3S69QN6FQ8YHYPZDII4WP747NP27',
            'BYQXNDCMNIUUM76FBPJYGA5RYIXPZBNX19',
            'CY1RRITNF6M3RZZI2VJVSJHCISRUPS491G',
            '9NC4V6YGVIMYEVPI7988C8N717R2RKIGTV',
            '6RF673RGWTQI2B5WW8ZKBHCSGWA3RR1IA8',
            'JN4MW7RT86JT6UR3YVR1DYKFFGS145KWQ9',
            '4W89RGRCYYQFMGPR6YS75ZFREVNDX9YR5F',
            'SNMFSFKFVESWKZR88YJ7F4WM4D4Q5DRGDC',
            'J97MH6PY91UWNSFTMYEG3UBGGNNDAEAVMA',
            'EG3V4UYHFDN16FWTSGFXYUDWDHUUX7GEPN',
            'W8FNZE11N6TIR962SWGVPEU7SJ9TJ9M9ZV',
            '34KN15PSVVJ482GG9YSCVCH5MSI9CEAEFI',
            'E5V7GX62GDZ9C8HIBHXXMFRWQZI621S5UQ',
            'HEX1W2914YPFMAGQUXA6YR3PPRYIM57E1T',
            'HCFBR3NCNWDKKHMWQ1UZZRXAIWBF16QGB3',
            'NWZEGPFHHH8NSPRPXCXGFVNNS1B4GF1PFE',
            'IPI7XT81P17UH11T6X13YESBZ8U2BWQNA9',
            '96U16AC6MB23FCYJK7HNTZMP9W6P7IU25K',
            'IQW2KZZSHKKTSCUT5ZE1GP4UBR4QEMXWRC',
            'FQMHUJXU3WRQZZPFZ83GIZWQCXPUZFXAME',
            'IXG11245YS7VTCI2GNWUND8XPJZ3FQ13NK',
            'FQMHUJXU3WRQZZPFZ83GIZWQCXPUZFXAME'
        ],
    [chainType.fantom]: [
        'KDEYVGVYGMJND7TNSCS1F6Y4R2XGVU1YGV',
        'E46YDV4MHTZ4Q6QEV16U99627CZNQNT2MU',
        '8KMZFC6SA6ZHIZHJXAD1JZFJS4CI2NDYWP',
        'FIWMKY2K2VXUQ9BHSX3WMC827IC5B1KEYV',
        '2WMXR4F4ZJIQPPR8V6GX8HCP9QEJ7GA6N6',
        '4KZBHGJNUE2VBJSD31ITCYP53BNE3Q5D9U',
        'G44IA24G5CBIH5FC858Q9YRFAJNIAP35VC',
        '9QXQNHRRD2NSIVBBB4KFZ4KZI5M3YKMJNU',
        'KPE1J1I81AP7MNUDXESABDRC4ST8WCZTE7',
        '3ZBCWZR2AR25QI69BHRK6BZV9Q98FW4J2F',
        'ST9UUZCA827BJ91V5X5448Y2XS7BDPAVSE',
        'A3JNCE8D1W6GY6J5PKW5V829DGNESXG3NX',
        'YX8VJZ79DFX4FZ8H6D9ABXHJ1VVS2H15AE',

        'IK2FDYG3QV6S66S9GTC5F5J1JIK6REWVNE',
        '29PYGPHP5ZKAHR2UGJYVWX7TIW1774A5GX',
        'QVP1WYEWC9RHPBR1BDV7WRUCJRBYS28GTQ',
        'D8DUPFPPIVN1SJX7N3W1FMD29Y4RXHN672',
        '4N9IRGPWTCUITIYQG15IK5VU97U6J5APNG',
        'QNV76QWT5N342S67274ETA7586R9CKR6WA',
        '49G3F2Y326D53HKKI664BDQ99BGWKPI26Z',
        '7E78MIX45FU1ABIBCQFBZ2DRKFUCT8BNRP',
        'VZU3HJMXXGY8TFWKSHCSXS1USBSDDW8I8T',
        'QJ95XA4DT7T8VJBB5DY128J5GSSFZN73FT',
        'EHVHJJSFVT56HWPQYRQTCVIZPIH5FKQIYD',
        '5MN7HMFNUREGR7TGWQTS1TTGGYEZBD6KGU',

        'KUVSG6XMVA9P86XCRCYW9URQHB5CUP21UY',
        '66EYMTXTCSPHCXKXK4CAEDCXGPDYGYK42H',
        'V34TQE2IJ5JFUEWGE8Q67B9W2B3VCEPT4C',
        'XSC9EHHQTAIH9JCF9MP3BQHI7HQSF8V52H',
        'ZAJP6HHIDYHBJT98WK6YZ8DMDI5PM7SFIN',
        '6HYRTJN9CDMCA736FJBN1H8WIC133T2V7P',
        'F1U9S6RH5YF4GAFQ8Y5KYNA38GIJ7JCR5M',
        'S3B6T5XHC9FFVQNDJ3SMQSRR2AM6BKKQYW',

        'KHIXFZF3V5HZZ9KB5DIPMI38CQ8YSVQP8C',
        'UPK9CZZW5JNA9G289B83TMNCWVBJ473JMC',

        'RECF5NTCZK9Q4HNSRX1FU1Z3YJPCRQUFZ1',
        'TFS7P2YC1GKY31XJW8JRWKXBEWEGB94X2R',
        'WAI4M7799N6EZQC4JNI26J2N3A4AXUYDAN',
        'P3K24DG1UEGF61V6SZ77CCWJWI3BNS8WJV',
        '55I2XV8N84EBNXKP1KZF6HWJDTFHTTSQ4U',
        'M9DKNJUEYWT6TFX69KWCA5DT7U5CM5343Y',
        'CDQ77GTYM3G59X14C5T1FGW5F8XQY3FVAC',
        '3JVQ6A62ZAYIAUQY38GNFMRR718KA8I2Z7',
        'CDH95BRQFV9W1GE16GZW9BTS37GRVU9UMJ',
        'YINERGNM6VWG62APD4GZE2UG7BFW3DI37D',
        'T8J9R4U2FQHTD192AUQR5GIIEXR51MJQIG',
        'UCZEF1PD677EVKI4JRXA4JFQDF8XWZQEH1',
        '126V9P1MS1Z88YQDSIDJRAVA21TRH7GTVV',
        'ZATYKWB4U8D1C6XJUVVZ255WP27QBZFCQ3',
        '88S3X1P32VFQDT1HIWPPYYYT19SFGAAMVA',
        'UDV335X42KHRKIGCDDPW464Y7HWPTSF35Q',
        'MYXEXRRWYU21EZP3515GGEFRY1ZMFIXX9R',
        'HA2SYFE3TR8YKS3PPCPC95IDMMU1PIU9GV',
        '8BS25PYDWQZH5N7NUGBFGDSP5BMED9XYGQ',
        'AQ771KG2CF8GFUJJ6UQV6DZAE2FTSRPKQ2',
        'BDNMUBY89JNGIEHYH43TKEBM9EJJ3SW2CR',
        'A2TZY5FMK6R88JMFZP2C8EZUJKBU3A3PY5',
        'R6TM7NIU24ZKU1E55URK3DTNKCHCIKNK98',
        'VVZ5DW6EE4CBGE5SQH9386XANIQAJAFRP1'
    ],
    [chainType.matic]: [
        'K6R8CAFHPZ4JIG5T4APKY7AI671HI7TPC5',
        'MFGDFTVGYQRT9I6WMY6VDEMAF4I4CXY971',
        '9HVDFE9B42ET4E71V4NWX611MRTUHUYXY4',
        'W8KCMG16CDHC3GFBDV5N66Y85WSP4J387G',
        '1K9Q52UQCSG2GUR2XR7KTPRQSZ4GD18J1F',
        '92ITHFNHYQJW9NGC17D2S73DKMBD1GS6NC',
        'YD7XSBB46RP6K4E5ZE2VP9NH5T7WQ5H455',
        'RCTHUJWNFNB17RBVK4BMMP77GZFMHK9UMP',
        'U16NB8RA5W5EV7GPYK94M5GAD7ZNU7D1M5',
        '72RKDXHIDF87YE2HQEG9PRK9CB4PRTH76D',
        '3VB37PQQKG92NUBH1R2E21R2K3NRH4QGIU',
        'UH98SF3GIEEZSRQXWTV3CPAJ4QSFJFZ8MH',
        'RKVMCENYV6Y5DKVY3SRFZ5HH4SRTS2VBNA',
        'ED8X2T9MH998D8B4K9XIF7YEU5JRWAFYDK',
        '4GCWAQTTUFWY4PITFRDGTB5DW1M16115S9',
        'BJ8NV4UFEHQNMYUJRB1PJ9XN837Y9DEAUW',
        'SSVXHW8HAG2WB57JQI314JPIBVJUGTQV8Y',
        'B7NFUVUYBTU3AX3CDPIGFMB6JSNNWH1RPV',
        '2WTIB9U7B54I8RV79K3NXMEDTVF9N726UC',
        'ZYZ25PDNVKT7RUIB4UN32ABJ95J4I4XT7V',
        'IBPCG74QKQZ5IK5GFDGXW6F8Z7HCVCRJJ3',
        'RF25NHE5G449VEZXFJPYKCGJU4ZTBH6CBX',
        'XEJKMUSI3EWIQG5I5DNZG3PYZMSYVBW5P4',
        '6NPM7FVQH8DMCP3E5MX2FSQT6KMTQKPMPF',
        '5VH9EAVBFPC8WZH5IFZ1T7BEYSPCJXAENK',
        '3637ERAZHJK7M8DPWQ2PCHNHICT6DCH452',
        'KPKHD72EH6GYSY2RK85TB3EXKPYKBKTVHK',
        'F4KYPPYM2I7AYCC2X83Y1587QT9JTY9Z1Q',
        'CATEDMKMYNEBIZ7PZESXR41DSRJYS62R1Y',
        'SIPMH4564TA5EMH5WKZBENJP6USPI8QWBS',
        'Y3YRPFR1V5JS8YQEYINZF1I8AQD1P3C5PK',
        'DXKD1QTI3SHRT92J7MZWNSYWIXB3ABAD9D',
        'NMV5HGF13AMW69N6GUWDEFKI6WEHUT1IBW',
        '5G4B61SBDK6Q34PZV9WFUB91F3XA21EHHV',
        'CS789Z1J9MJ3P35UMC5UHJFQWEGV6MTQQ9',
        'SHI3N3TY1FAIVCKY91TXNT7YXA6AKQM86',
        'M2PUQ2HHCEAWWTVK6ANTMZ4SJVZ7CNVB7T',
        'HDZGKPBZGR1YZFU8APYJAP62IAI1DR4SSE',
        '6WYAU8BV5CMP22AMNA8M4TCGDUI4DMUWCF',
        'XFVK6KBMXE36WIN5H48BFDZ6RR4EGAMCFM',
        'G7WSP5AHG2NBW4KXZ8SWPUCZFBRSBXTK5S',
        'QCRVM91EC8XHMXMMZF64PNWIZ2DSU1KM4B',
        'C4VNNKHVQSQXVHN1GWI6QNRHWYQC7HVEB2',
        'HQJX9A1FQIBVACPIEN8K5QPUJ2EGN5DCIY',
        'AHV9ICUCKXVXM1TYIF64G21W67JK1BGI7H',
        'W22HKNW7V6FA49CEHQF5WGDMRS6KN9H3PD',
        'BYK9SQYK5ZX4RZF1DFK2DQDT6972Q4WZKJ',
        '19KPM2FIJ2MH7AZ348WZ27HXKCJR6XBKVC',
        'JHGTVBVTI8E7ND4UKFCDP7AMIQTETMVGKD',
        'Q1MWZYDIY5G6TM748BS8A8DFSIA2GZ9THR',
        'SPRTXKR2IKM69BRJIAF93PUE1MJB9HX4X2',
        'GN1HEYDVJC51EJ9M77H6XJNRH33XD6U62V',
        'FEG64IME6KH2WS3PHACGBVZ91BWFHDHYYH',
        'PCE4BIYT5RAFGWA9SUB8PTCYZA4SMTFR7U',
        'RFF2TPGCP5E9TPCNZ6BZI5W9VPIWMJKCV6',
        'PCE4BIYT5RAFGWA9SUB8PTCYZA4SMTFR7U',
        'SDK5Y7S9WY5S4XC4556XMPAD61AY7UWBUU',
        'WRX4R1GSDM1AAM68MY5AX1ER7RT7IUQ86M'
    ],
    [chainType.heco]: ['88885DHDHX84RRWC1RCB353MT5BQSGV1DW', 'I1BXZV7BPAAHV8JA9VVU6DYP5UKHJ8E942', 'K77QHJX7H2H9AS9I649PQ78IKNZFNAN858'],
    [chainType.optimism]: [
        '4GE7RU7UVAQ6WZR4QNI6HG47XMTXDZ8WTA',
        'HZYFM4T9PVFA94DHAV1SN1WRIZBVWQNKGY',
        'YBEMINBM3K7XXP1K5ZSG813FUT19Q5HTXG',
        'NIUQHM34DJ868C2Q2R4CN8MX42VZCCAPZT',
        'HN8QRSGB3UZ4P6EPGM3AXVSKPUJ3I97FAZ',
        'M24RBJGFCSCXT5EW3YAI4RAH3GZDV3KXNT',
        '9C9B47FXKHJ9X8S6XM99WA7Z62NF3P8N37',
        'ZMU1IBT7YSR3ZIA7GSV4ZQFUWHPD5AI41S',
        '9Q57EFEGPX9DM9Z3CNI94J9ABVR2CED5DW',
        '9PQSEFE2BVGGBB4271UQMPJQUD449Q455H',
        '4W9XNBARJRH5ZMGJYFMM6EBI4986GWNC1G',
        'AYHQJ6S314UCADJYQ2SPSWNYKBYKK6FGCT']
}
export const SYSTEM_KEY = {
    C98STARIPPN: 'starship',
    C98AMBEOLCN: 'amberBlocks',
    C98SUPAGEIR: 'superlinkCoin98',
    C98SUPIMNKM: 'superlink',
    C98ISSNKIMK: 'insight',
    C98WLFININS: 'wallet',
    C98EXTMSKWE: 'extension',
    C98HUWAEXMK: 'labs',
    C98BARYDMWN: 'baryon',
    C98SARMENCS: 'saros',
    C98ANCMEK8W: 'ancient8',
    C98DAGDBMQ9: 'dagora',
    C98GIFT: 'giftcard',
    wallet: 'wallet'
}
const REQUEST_TYPE = {
    GET: 'get',
    POST: 'post'
}

export const onlyUnique = (value, index, self) => {
    return self.indexOf(value) === index
}
export const convertWeiToBalance = (strValue: string, iDecimal = 18) => {
    try {
        if (strValue) {
            var multiplyNum = new bigdecimal.BigDecimal(Math.pow(10, iDecimal))
            var convertValue = new bigdecimal.BigDecimal(String(strValue))

            return convertValue.divide(multiplyNum).toString()
        }
        return 0
    } catch (error) {
        return 0
    }
}
export const convertWeiToBalanceV2 = (strValue, iDecimal = 18) => {
    try {
        const decimalFormat = parseFloat(String(iDecimal))

        const multiplyNum = new bigdecimal.BigDecimal(Math.pow(10, decimalFormat))
        const convertValue = new bigdecimal.BigDecimal(String(strValue))
        return convertValue.divide(multiplyNum, decimalFormat, bigdecimal.RoundingMode.DOWN()).toString()
    } catch (error) {
        return 0
    }
}

const getLength = (value: any) => {
    return value ? value.length : 0
}

const size = (value: any) => {
    return value ? value.length : 0
}

const lowerCase = (value: string) => {
    return value ? value.toLowerCase() : value
}

export const convertHexToDecimal = (hexNum: string) => {
    return converter.hexToDec(hexNum)
}
export const convertDecimalToHex = (number: string) => {
    return converter.decToHex(number.toString())
}
export const formatHistoryUnique = (arrTransaction) => {
    const arrHashUnique = arrTransaction.slice(0).map(it => it.hash).filter(onlyUnique)

    const arrFinalHistory = arrHashUnique.map(hash => {
        const transaction = arrTransaction.find(tx => tx.hash === hash)
        return transaction
    })
    return arrFinalHistory
}
export const fetchAPI = async (apiurl: string, headers?: any) => {
    try {
        const response = await fetch(apiurl, headers)

        if (response.status === 200) {
            const responJson = await response.json()
            return responJson
        }

        if (response.status === 429) {
            return await fetchAPI(apiurl, headers)
        }
        if (response.status === 500) {
            return false
        }

        const responJson = await response.json()
        return responJson
    } catch (error) {
        console.log('error', error)
        return false
    }
}
const publicKeyFromPkHex = (publicKeyHex: string) => {
    if (!/^0(1[0-9a-fA-F]{64}|2[0-9a-fA-F]{66})$/.test(publicKeyHex)) {
        throw new Error('Invalid public key')
    }
    const publicKeyHexBytes = new Uint8Array(Buffer.from(publicKeyHex, 'hex'))

    return publicKeyHexBytes.subarray(1)
}
const uint8ArrayPkToAccountHash = (uint8ArrayPk: Uint8Array) => {
    try {
        const algorithmIdentifier = 'ED25519'
        const separator = Uint8Array.from([0])
        const prefix = Buffer.concat([
            Buffer.from(algorithmIdentifier.toLowerCase()),
            separator
        ])

        if (uint8ArrayPk.length === 0) {
            return Uint8Array.from([])
        } else {
            return blake.blake2b((concat([prefix, uint8ArrayPk])), null, 32)
        }
    } catch (error) {
        console.log('err', error)
    }
}
export default class WalletServices {
    static async getApproval(param: any) {
        const { address, chain, page, size } = param

        if (chain === chainType.tomo) {
            const queryValue = {
                account: address,
                page,
                offset: page,
                limit: size
            }

            return {
                url: LINK_EXPLORER_API[chain] + 'transaction/list',
                query: queryValue
            }
        } else if (chain === chainType.ancient8 || chain === chainType.ancient8Testnet) {
            const baseUrl = chain === chainType.ancient8 ? 'https://scan.ancient8.gg' : 'https://scanv2-testnet.ancient8.gg'
            const url = `${baseUrl}/api/v2/addresses/${address}/transactions`
            if (parseInt(page) === 1) {
                return {
                    url,
                    query: {}
                }
            } else {
                // let currPage =1
                // while (currPage<page-1){
                //   const payload =
                // }
                const payload = await axios.get(url)
                const fromBlock = get(payload, 'data.next_page_params.block_number', 0)
                const index = get(payload, 'data.next_page_params.index', 0)

                if (page === 2) {
                    return {
                        url,
                        query: {
                            block_number: fromBlock,
                            index
                        }
                    }
                } else {
                    let currPage = 2
                    let fromBlockFetch = fromBlock
                    let indexFetch = index
                    while (currPage < (page - 1)) {
                        const newUrl = `${baseUrl}/api/v2/addresses/${address}/transactions?block_number=${fromBlockFetch}&index=${indexFetch}`
                        const payload = await axios.get(newUrl)
                        fromBlockFetch = get(payload, 'data.next_page_params.block_number', 0)
                        indexFetch = get(payload, 'data.next_page_params.index', 0)
                        currPage++
                    }
                    return {
                        url,
                        query: {
                            block_number: fromBlockFetch,
                            index: indexFetch
                        }
                    }
                }
            }
        } else {
            const apiKey = _.sample(KEY_EXPLORER_API[chain])

            const queryValue = {
                action: 'txlist',
                module: 'account',
                address,
                apiKey,
                page: parseFloat(page || 0) + 1,
                offset: size,
                sort: 'desc'
            }

            return {
                url: LINK_EXPLORER_API[chain],
                query: queryValue
            }
        }


    }

    static async getHistory(params:any) {
        const { page, size, token, address } = params
        const tokenAddress = token ? token.chain === chainType.terra ? token.denom : token.address : ''

        let arrHistory = await ExplorerServices.getTokenTransaction(token.chain, address, tokenAddress, page, size, token.bnbId, token.decimal)

        if (arrHistory && arrHistory.map && getLength(arrHistory) > 0) {
            arrHistory = arrHistory.map((data:any) => {
                const newData = data
                if (data.transactionHash) {
                    newData.hash = data.transactionHash
                }
                if (newData.timestamp || newData.timeStamp) {
                    newData.date = new Date((newData.timestamp || newData.timeStamp) * 1000)
                }

                const CHAIN_NO_NEED_FORMAT = ['seiEvm', chainType.casper, chainType.functionX, chainType.kucoin, chainType.bitcoin, chainType.binance, chainType.near,
                    chainType.polkadot, chainType.avaxX, chainType.kusama, chainType.tron,
                    chainType.thor, chainType.cosmos, chainType.terra, chainType.band, chainType.kava, chainType.persistence,
                    chainType.kardia,
                    chainType.elrond, chainType.helimum, chainType.omg, chainType.dogecoin, chainType.ronin, chainType.okex,
                    chainType.klaytn, chainType.secretNetwork,
                    chainType.cronos, chainType.theta, chainType.thetaFuel, chainType.bittorrent, chainType.moonbeam, chainType.ton, chainType.platon]

                if (!CHAIN_NO_NEED_FORMAT.includes(token.chain)) {
                    newData.amount = token.chain === chainType.tomo
                        ? convertWeiToBalance(data.value)
                        : convertWeiToBalance(data.value, getLength(tokenAddress) > 0 ? token.decimal : 18)
                }
                return newData
            }).sort((a, b) => b.timeStamp - a.timeStamp)

            if (address.startsWith('0x') && tokenAddress) {
                return arrHistory.filter((item:any) => item != null)
            } else {
                return WalletServices.verifyResult(formatHistoryUnique(arrHistory).filter(item => item != null))
            }
        } else {
            return []
        }
    }

    static verifyResult(output, init = []) {
        if (!output) {
            return init
        } else {
            return output
        }
    }
}

export class ExplorerServices {
    static async getTransaction(account, offset = 1, limit = 25) {
        return this.postGateWay('transaction/list', REQUEST_TYPE.GET, undefined, { account, offset: (offset - 1) * limit, limit })
    }

    static async getTokenTransaction(chain: string, holder: string | string[], token: IToken | string | string[], page = 1, limit = 25, bnbId: string, tokenDecimals = 18) {
        if (chain === chainType.bitcoin) {
            return []
        } else if (chain === chainType.polkadot || chain === chainType.kusama) {
            const responseHistory = await ExplorerServices.postGateWayPolkadot(holder, page - 1, limit, chain)

            if (responseHistory && getLength(responseHistory.data) > 0) {
                const isHaveTransfer = getLength(responseHistory.transfer) > 0

                const mergeData = await responseHistory.data.reduce(async (array, item) => {
                    const newArray = await array
                    const findTransfer = isHaveTransfer ? responseHistory.transfer.find(data => data.id.split('-')[0] === item.id.split('-')[0]) : false

                    const link = `https://explorer-32.polkascan.io/api/v1/${chain}/extrinsic/0x${item.attributes.extrinsic_hash}`
                    const txDetail = await axios.get(link)

                    const timeStamp = String(new Date(txDetail.data.data.attributes.datetime).getTime() / 1000)
                    let transaction = {}

                    const txParams = txDetail.data.data.attributes.params

                    if (txDetail.data.data.attributes.params[0].name !== 'calls') {
                        transaction = {
                            hash: `0x${item.attributes.extrinsic_hash}`,
                            from: findTransfer ? findTransfer.attributes.sender.attributes.address : item.attributes.address,
                            to: findTransfer ? findTransfer.attributes.destination.attributes.address : txDetail.data.data.attributes.params[0].value,
                            timeStamp: parseFloat(timeStamp),
                            amount: findTransfer ? convertWeiToBalance(findTransfer.attributes.value, 10) : convertWeiToBalance(txDetail.data.data.attributes.params[1].value, 10)
                        }
                    } else {
                        transaction = {
                            hash: `0x${item.attributes.extrinsic_hash}`,
                            from: findTransfer ? findTransfer.attributes.sender.attributes.address : item.attributes.address,
                            to: txParams[0].value[0].call_args[0].value,
                            timeStamp: parseFloat(timeStamp),
                            amount: findTransfer ? convertWeiToBalance(findTransfer.attributes.value, 10) : convertWeiToBalance(txParams[0].value[0].call_args[1].value, 10)
                        }
                    }
                    newArray.push(transaction)
                    return newArray
                }, [])

                return mergeData.sort((a, b) => a.timeStamp > b.timeStamp ? -1 : 1)
            } else {
                return []
            }
        } else if (chain === chainType.tron) {
            const listHistory = await ExplorerServices.postGateWayTron(holder, page - 1, limit, token)
            if (getLength(listHistory) > 0) {
                const finalData = listHistory.map(item => {
                    return {
                        hash: token ? item.transaction_id : item.transactionHash,
                        from: token ? item.from_address : item.transferFromAddress,
                        to: token ? item.to_address : item.transferToAddress,
                        timestamp: parseFloat(token ? item.block_ts : item.timestamp),
                        amount: convertWeiToBalance(token ? item.quant : item.amount, item.tokenInfo.tokenDecimal)
                    }
                })
                return finalData
            }
            return []
        } else if (chain === chainType.cosmos) {
            const listHistory = await ExplorerServices.postGateWayComos(holder, page, limit)
            if (getLength(listHistory) > 0) {
                const finalData = listHistory.map(it => {
                    return {
                        hash: it.data.txhash,
                        from: it.data.tx.body ? it.data.tx.body.messages[0].from_address : it.data.tx.value.msg[0].value.from_address,
                        to: it.data.tx.body ? it.data.tx.body.messages[0].to_address : it.data.tx.value.msg[0].value.to_address,
                        timeStamp: (new Date(it.header.timestamp)).getTime() / 1000,
                        amount: convertWeiToBalance(it.data.tx.body ? it.data.tx.body.messages[0].amount[0].amount : it.data.tx.value.msg[0].value.amount[0].amount, 6)
                    }
                })
                return finalData.sort((a, b) => a.timeStamp - b.timeStamp > 0 ? 1 : 0)
            }
            return []
        } else if (chain === chainType.functionX) {
            const data = await ExplorerServices.postGateWayFunctionX(holder, page, limit)

            return data
        } else if (chain === chainType.thor) {
            const listHistory = await ExplorerServices.postGateWayThor(holder, page)
            if (getLength(listHistory) > 0) {
                const finalData = listHistory.map(it => {
                    return {
                        hash: it.hash,
                        from: it.extra.events[0].params.fromAddress,
                        to: it.extra.events[0].params.toAddress,
                        timeStamp: (new Date(it.timestamp)).getTime() / 1000,
                        amount: convertWeiToBalance(it.extra.events[0].params.coins[0].amount, 8)
                    }
                })
                const sortedData = finalData.slice(0).reverse()
                return sortedData
            }
            return []
        } else if (chain === chainType.terra) {
            const listHistory = await ExplorerServices.postGateWayTerra(holder, page, token === '' ? limit : 100)
            if (listHistory && getLength(listHistory.txs) > 0) {
                const finalData = listHistory.txs.map(it => {
                    if (it.tx.value.msg[0].type === 'bank/MsgSend' && token === '') {
                        return {
                            hash: it.txhash,
                            from: it.tx.value.msg[0].value.from_address,
                            to: it.tx.value.msg[0].value.to_address,
                            timeStamp: (new Date(it.timestamp)).getTime() / 1000,
                            amount: convertWeiToBalance(it.tx.value.msg[0].value.amount[0].amount, 6)
                        }
                    } else if ((token as string[]).length < 20 && it.tx.value.msg[0].value.amount && it.tx.value.msg[0].value.amount[0].denom === token) {
                        const data = {
                            hash: it.txhash,
                            from: it.tx.value.msg[0].value.from_address,
                            to: it.tx.value.msg[0].value.to_address,
                            timeStamp: (new Date(it.timestamp)).getTime() / 1000,
                            amount: convertWeiToBalance(it.tx.value.msg[0].value.amount[0].amount, 6)
                        }
                        return data
                    } else if (it.tx.value.msg[0].type === 'wasm/MsgExecuteContract' && (token as string[]).length >= 20) {
                        const isFrom = it.logs[0].events[1].attributes[2].value === holder
                        return {
                            hash: it.txhash,
                            from: isFrom ? holder : token,
                            to: isFrom ? token : holder,
                            timeStamp: (new Date(it.timestamp)).getTime() / 1000,
                            amount: convertWeiToBalance(it.logs[0].events[1].attributes[4].value, 6)
                        }
                    } else return null
                })
                const filterFinalList = finalData.slice(0).filter(it => it)

                return filterFinalList
            }
        } else if (chain === chainType.kava) {
            return []
        } else if (chain === chainType.band) {
            const listhistory = await ExplorerServices.postGateWayBand(holder, page, limit)
            if (getLength(listhistory) > 0) {
                const finalData = listhistory.map(transaction => {
                    return {
                        hash: transaction.data.txhash,
                        from: transaction.data.tx.body.messages[0].from_address || transaction.data.tx.body.messages[0].delegator_address,
                        to: transaction.data.tx.body.messages[0].to_address || transaction.data.tx.body.messages[0].validator_address,
                        timeStamp: (new Date(transaction.header.timestamp)).getTime() / 1000,
                        amount: convertWeiToBalance(transaction.data.tx.body.messages[0].amount.amount, 6)
                    }
                })
                const filterData = finalData.filter(it => it)
                return filterData
            }
            return []
        } else if (chain === chainType.persistence) {
            return []
        } else if (chain === chainType.avaxX) {
            const formatHolder = typeof holder === 'string' ? [holder] : (holder.filter ? holder.filter(itm => itm) : [])

            const result = (typeof holder === 'string' || getLength(formatHolder) === 1) ? await this.postGateWayAvaxXSingleAddress(formatHolder[0], page, limit) : await this.postGateWayAvaxX(formatHolder, page, limit)

            const formatedTxs = result.map(it => {
                if (it.type === 'add_validator') return null

                const inputAddr = it.inputs && it.inputs[0].output.addresses[0]
                const outputAddr = it.outputs && it.outputs[0].addresses[0]
                let address

                const foundInput = it.inputs ? it.inputs.filter(it => {
                    const arrSame = []
                    for (const item of it.output.addresses) {
                        if (formatHolder.includes(`${item}`)) {
                            arrSame.push(item)
                            address = `X-${item}`
                        }
                    }
                    return arrSame.length > 0
                }) : null

                const foundOutput = it.outputs ? it.outputs.filter(it => {
                    const arrSame = []
                    for (const item of it.addresses) {
                        if (formatHolder.includes(`${item}`)) {
                            arrSame.push(item)
                            address = item
                        }
                    }
                    return arrSame.length > 0
                }) : null

                if (it.type === 'export') {
                    const exportArray = it.outputs.filter(item => {
                        return item.chainID === '2q9e4r6Mu3U68nU1fYjgbR6JvwrRx36CohpAX5UQxse55x1Q5'
                    })
                    const exportAmount = exportArray.reduce((a, b) => +a + +b.amount, 0)
                    return {
                        hash: it.id,
                        from: `X-${inputAddr}`,
                        to: `C-${outputAddr}`,
                        amount: convertWeiToBalance(exportAmount, 9),
                        timeStamp: new Date(it.timestamp).getTime() / 1000
                    }
                }
                if (it.type === 'import') {
                    return {
                        hash: it.id,
                        from: `X-${inputAddr}`,
                        to: `X-${outputAddr}`,
                        amount: convertWeiToBalance(it.outputs.reduce((a, b) => +a + +b.amount, 0), 9),
                        timeStamp: new Date(it.timestamp).getTime() / 1000
                    }
                }
                if (it.type === 'base') {
                    let amountBase
                    if (getLength(foundInput) === getLength(it.inputs) && getLength(foundOutput) === getLength(it.outputs)) {
                        const isOuptSmall = getLength(it.inputs) === 1
                        amountBase = isOuptSmall ? it.outputs[0].amount : it.outputs[1].amount
                        return {
                            hash: it.id,
                            from: `X-${foundInput ? address : inputAddr}`,
                            to: `X-${foundOutput ? address : outputAddr}`,
                            amount: convertWeiToBalance(amountBase, 9),
                            timeStamp: new Date(it.timestamp).getTime() / 1000
                        }
                    } else if (getLength(foundInput) === getLength(it.inputs)) {
                        const arrRecieve = it.outputs.filter(item => {
                            const senderOutput = []
                            for (const address of item.addresses) {
                                if (!formatHolder.includes(`${address}`)) {
                                    senderOutput.push(address)
                                }
                            }
                            return senderOutput.length > 0
                        })
                        amountBase = arrRecieve.reduce((total, item) => parseFloat(total) + parseFloat(item.amount), 0)
                        return {
                            hash: it.id,
                            from: `X-${address}`,
                            to: `X-${arrRecieve[0].addresses[0]}`,
                            amount: convertWeiToBalance(amountBase, 9),
                            timeStamp: new Date(it.timestamp).getTime() / 1000
                        }
                    } else {
                        const arrRecieve = it.outputs.filter(item => {
                            const arrOutput = []
                            for (const address of item.addresses) {
                                if (formatHolder.includes(`${address}`)) {
                                    arrOutput.push(address)
                                }
                            }
                            return arrOutput.length > 0
                        })

                        amountBase = arrRecieve.reduce((total, item) => parseFloat(total) + parseFloat(item.amount), 0)

                        const arrSend = it.inputs.filter(item => {
                            const senderOutput = []
                            for (const address of item.output.addresses) {
                                if (!formatHolder.includes(`${address}`)) {
                                    senderOutput.push(address)
                                }
                            }
                            return senderOutput.length > 0
                        })
                        return {
                            hash: it.id,
                            from: `X-${arrSend[0].output.addresses[0]}`,
                            to: `X-${address}`,
                            amount: convertWeiToBalance(amountBase, 9),
                            timeStamp: new Date(it.timestamp).getTime() / 1000
                        }
                    }
                }
                return null
            })
            return formatedTxs.filter(itm => itm)
        } else if (chain === chainType.near) {
            const txsList = await this.postGateWayNear(holder, page, token)
            if (getLength(txsList) > 0) {
                const formatedTxsList = txsList.map(it => {
                    let amount = 0

                    if (getLength(it.actions) > 0) {
                        const findTransfer = it.actions.find(tx => tx.kind === 'Transfer')
                        if (findTransfer) {
                            amount = convertWeiToBalanceV2(get(findTransfer, 'args.deposit', 0), 24)
                        }
                    }

                    return {
                        hash: it.hash,
                        from: it.signerId,
                        to: it.receiverId,
                        timeStamp: Math.round(it.blockTimestamp / 1000),
                        amount
                    }
                })
                return formatedTxsList
            }
            return []
        } else if (chain === chainType.binance) {
            const txsList = await this.postGateWayBinance(holder, page, limit, bnbId)
            if (getLength(txsList.txArray) === 0) return []
            const finalList = txsList.txArray.map(it => {
                return {
                    hash: it.txHash,
                    from: it.fromAddr,
                    to: it.toAddr,
                    amount: it.value,
                    timeStamp: it.timeStamp / 1000
                }
            })
            return finalList
        } else if (chain === chainType.kardia) {
            let arrTxs = []
            if (getLength(token)) {
                arrTxs = await this.postGateWayKardiaTokens(holder, page, limit, token)
            } else {
                arrTxs = await this.postGateWayKardia(holder, page, limit)
            }
            if (getLength(arrTxs) > 0) {
                return arrTxs.map(it => {
                    return {
                        hash: token ? it.transactionHash : it.hash,
                        from: it.from,
                        to: it.to,
                        amount: convertWeiToBalance(it.value, token ? it.decimal : 18),
                        timeStamp: (new Date(it.time)).getTime() / 1000
                    }
                })
            } else {
                return []
            }
        } else if (chain === chainType.elrond) {
            const listHistory = await this.postGateWayElrond(holder, page, limit)

            if (getLength(listHistory) > 0) {
                return listHistory.map(it => {
                    return {
                        hash: it.txHash,
                        from: it.sender,
                        to: it.reciever,
                        amount: it.value,
                        timeStamp: it.timestamp
                    }
                })
            }
            return []
        } else if (chain === chainType.casper) {
            const listHistory = await this.postGateWayCasper(holder, page, limit)
            return listHistory
        } else if (chain === chainType.okex) {
            const listHistory = await this.postGateWayOkex(holder, page, limit, token)

            return listHistory.hits.map(it => {
                return {
                    hash: it.txhash || `0x${it.hash}`,
                    from: token ? it.from : it.from[0],
                    to: token ? it.to : it.to[0].address,
                    amount: it.value,
                    timeStamp: it.blockTimeU0 / 1000
                }
            })
        } else if (chain === chainType.klaytn) {
            return []
        } else if (chain === chainType.omg) {
            const tokenAddress = token || '0xd26114cd6ee289accf82350c8d8487fedb8a0c07'
            const data = await this.postGateWayOMG(holder, page, limit, tokenAddress)
            let decimals = 18
            if (token) {
                const tokenLink = `https://blockexplorer.mainnet.v1.omg.network/api/token/${token}`
                const tokenData = await axios.get(tokenLink)
                decimals = tokenData.data.token_decimals
            }

            return data.map(it => {
                const isFrom = it.inputs.find(item => item.owner === holder)
                const output = it.outputs.find(item => item.owner === holder)
                return {
                    hash: it.txhash,
                    from: isFrom ? holder : it.inputs[0] ? it.inputs[0].owner : null,
                    to: isFrom ? it.outputs[0].owner : holder,
                    amount: isFrom ? convertWeiToBalance(isFrom.amount, decimals) : convertWeiToBalance(output.amount, decimals),
                    timeStamp: (new Date(it.inserted_at)).getTime() / 1000
                }
            })
        } else if (chain === chainType.dogecoin) {
            const data = await this.postGateWayDogeCoin(holder, page, limit)
            const decimals = 8

            return data.map(it => {
                const isFrom = it.inputs.find(item => item.recipient === holder)
                const output = it.outputs.find(item => item.recipient === holder)
                return {
                    hash: it.transaction.hash,
                    from: isFrom ? holder : it.inputs[0] ? it.inputs[0].recipient : null,
                    to: isFrom ? it.outputs[0].recipient : holder,
                    amount: isFrom ? convertWeiToBalance(isFrom.value, decimals) : convertWeiToBalance(output.value, decimals),
                    timeStamp: (new Date(it.transaction.time)).getTime() / 1000
                }
            })
        } else if (chain === chainType.ronin) {
            const data = await this.postGateWayRonin(holder, page, limit, token)
            return data.map(it => {
                return {
                    hash: token ? it.txHash : it.hash,
                    from: it.from,
                    to: it.to,
                    timeStamp: it.timestamp,
                    amount: convertWeiToBalance(it.value, it.tokenDecimals)
                }
            })
        } else if (chain === chainType.kucoin) {
            const data = await this.postGateWayKCC(holder, page, limit, token)
            if (!data) return []
            return data.map(it => {
                return {
                    hash: it.txid,
                    from: it.from,
                    to: it.to,
                    timeStamp: it.time,
                    amount: token ? convertWeiToBalance(it.value, it.tokenInfo.d) : it.value
                }
            })
        } else if (chain === chainType.secretNetwork) {
            const data = await this.postGateWaySecret(holder, page, limit)
            if (getLength(data) > 0) {
                return data.map(it => {
                    return {
                        hash: it.hash,
                        from: it.from,
                        to: it.to,
                        timeStamp: Math.floor(it.date / 1000),
                        amount: it.value
                    }
                })
            }
            return []
        } else if (chain === chainType.theta || chain === chainType.thetaFuel) {
            const data = await ExplorerServices.postGateWayThetaNetwork(holder as string, chain, token, page, limit)
            return data
        } else if (chain === chainType.ton) {
            const data = await ExplorerServices.postGateWayThetaNetwork(holder as string, chainType.ton, page, limit)
            return data
        } else if (chain === chainType.ancient8) {
            return await this.postGateWayAncient8(holder, token, page, limit)
        } else if (chain === chainType.ancient8Testnet) {
            return await this.postGateWayAncient8Testnet(holder, token, page, limit)
        } else if (chain === chainType.coreDao) {
            return await this.postGateWayCoreDao(holder, token, page, limit)
        } else if (chain === 'seiEvm') {
            return await this.getSeiEVM(holder as string, token, page, limit)
        } else {
            const isTokenTxs = getLength(token) > 0

            if (LINK_EXPLORER_API[chain] && chain !== chainType.tomo) {
                const apiKey = sample(KEY_EXPLORER_API[chain] || [])
                const queryValue: Record<string, any> = {
                    startblock: 0,
                    endblock: 99999999999999,
                    action: isTokenTxs ? 'tokentx' : 'txlist',
                    module: 'account',
                    address: holder,
                    offset: limit,
                    page,
                    sort: 'desc'
                }
                if (apiKey) {
                    queryValue.apiKey = apiKey
                }

                if (isTokenTxs) {
                    queryValue.contractaddress = token
                }

                const queryStr = QueryString.stringify(queryValue)
                const data = await this.postGateWayEther('', queryStr, chain)
                if (data) {
                    const resultData = data.result
                    if ((chain === chainType.binanceSmart || chain === chainType.heco) && getLength(resultData) > 0 && typeof (resultData) === 'object') {
                        const fullHash = resultData.map(item => item.hash).filter(onlyUnique)
                        return fullHash.map(item => {
                            return resultData.find(data => data.hash === item)
                        }).filter(item => item)
                    }
                    return resultData
                }
                return []
            } else {
                if (chain === chainType.harmony) {
                    const data = await this.getHarmonyTxs(holder, page, limit)
                    if (!data) return []
                    return data.map(it => {
                        return {
                            hash: it.hash,
                            from: it.from,
                            to: it.to,
                            timeStamp: it.timestamp,
                            value: convertHexToDecimal(it.value)
                        }
                    })
                } else {
                    if (chain === chainType.tomo) {
                        if (isTokenTxs) {
                            return this.postGateWay('tokentx/list', REQUEST_TYPE.GET, undefined, { account: holder, tokenAddress: token, offset: (page - 1) * limit, limit })
                        } else {
                            return this.postGateWay('transaction/list', REQUEST_TYPE.GET, undefined, { account: holder, offset: (page - 1) * limit, limit })
                        }
                    } else {
                        return []
                    }
                }
            }
        }
    }

    static async getSeiEVM(address: string, token?: any, page?: any, limit?: any) {
        const payload = await axios.get(`https://arctic-1-api.seitrace.com/api/v2/addresses/${address}/transactions`)
        if (size(get(payload, 'data.items')) > 0) {
            return payload.data.items.map(it => {
                return {
                    hash: it.hash,
                    from: get(it, 'from.hash', ''),
                    to: get(it, 'to.hash', ''),
                    timeStamp: moment(it.timestamp).unix(),
                    amount: convertWeiToBalance(it.value)
                }
            })
        }
        return []
    }

    static async getHarmonyTxs(address, pageIndex, pageSize) {
        const payload = await axios.post('https://api.harmony.one', {
            jsonrpc: '2.0',
            method: 'hmy_getTransactionsHistory',
            params: [{
                address,
                pageIndex: pageIndex - 1,
                pageSize,
                fullTx: true,
                txType: 'ALL',
                order: 'ASC'
            }],
            id: 1
        })
        if (payload) {
            return payload.data.result.transactions
        }
        return []
    }

    static async verifyOtpCode(id, otp, refId) {
        const body = {
            id, otp, refId
        }

        return this.postGateWay('user/verifyOtp', REQUEST_TYPE.POST, body)
    }

    static async postGateWayKCC(address, page, size, tokenAddress) {
        let link = `https://explorer.kcc.io/api/kcs/address/normal/${lowerCase(address)}/${page}/${size}`
        if (getLength(tokenAddress) > 0) {
            link = `https://explorer.kcc.io/api/kcs/address/tokentrans/${lowerCase(address)}/${lowerCase(tokenAddress)}/${page}/${size}`
        }

        const payload = await axios.get(link)

        if (payload) {
            return payload.data.data
        }
        return []
    }

    static async postGateWaySecret(address, page, size) {
        const link = `https://app.citadel.one/api/transactions/secret/${address}?offset=${(page - 1) * size}&limit=${size}`
        const payload = await axios.get(link, { headers: { Cookie: '1129ce3fa4414568388599223c639643=969469dd813cce0a213b904826e3b690; SID=s%3ApcfUMbMKgEjEFV7WSeqXX4oQ3uL3QbE9.jAthL6OCSwnZkxnWKA3jwpI3MQBAsDwOU7aKF3lIjII; fe13d42287df0ec2731a1757d138b226=d80fed24378942ad14d47b6c30ee19f4' } })
        if (payload && payload.data && payload.data.ok) {
            const arrTxs = payload.data.data.list
            return arrTxs
        }
        return []
    }

    static async postGateWayRonin(address, page, size, tokenAddress) {
        const pageSize = `from=${(page - 1) * size}&size=${size}`

        const link =
            tokenAddress
                ? `https://explorer.roninchain.com/api/tokentxs?addr=${tokenAddress}&${pageSize}&token=ERC20`
                : `https://explorer.roninchain.com/api/txs/${address}?${pageSize}`

        const payload = await fetchAPI(link)

        return get(payload, 'results')
    }

    static async postGateWayDogeCoin(address, page, size) {
        const link = `https://api.blockchair.com/dogecoin/dashboards/address/${address}?limit=${size}&offset=${(page - 1) * size}`

        const payload = await axios.get(link)
        if (getLength(get(payload, `data.data[${address}].transactions`)) > 0) {
            const arrTxsHash = payload.data.data[address].transactions

            const arrTxFetch = arrTxsHash

            const arrTxsSplit = []
            let arrTxs = []

            while (arrTxFetch.length) {
                arrTxsSplit.push(arrTxFetch.splice(0, 10))
            }

            await arrTxsSplit.reduce(async (chain, item, index) => {
                const txsString = item.join(',')
                const txsLink = `https://api.blockchair.com/dogecoin/dashboards/transactions/${txsString}`

                const arrTxsDetailPayload = await axios.get(txsLink)

                if (arrTxsDetailPayload) {
                    const txsDetailObject = arrTxsDetailPayload.data.data

                    arrTxs = [...arrTxs, ...Object.values(txsDetailObject)]
                }
            }, [])
            return arrTxs
        } else {
            return []
        }
    }

    static async postGateWayOMG(address, page, size, token) {
        const link = 'https://watcher-info.mainnet.v1.omg.network/transaction.all'
        let currPage = 1
        let arrTxs = []

        while (arrTxs.length < page * size && currPage !== -1) {
            const res = await axios({
                method: 'POST',
                url: link,
                data: {
                    page: currPage,
                    limit: 100,
                    address: address
                }
            })

            if (res.data && getLength(res.data.data) > 0) {
                const arrFiltered = res.data.data.filter(it => {
                    const foundInputs = it.inputs.find(input => input.owner === address)
                    const foundOutput = it.outputs.find(output => output.owner === address)

                    if (foundInputs) {
                        if (foundInputs.currency === token) {
                            return true
                        }
                    } else {
                        if (foundOutput.currency === token) {
                            return true
                        }
                    }
                    return false
                })
                arrTxs = [...arrTxs, ...arrFiltered]
                currPage++
            }
            currPage = -1
        }
        return arrTxs
    }

    /// not use
    static async postGateWayHelium(address, page, size) {
        let link = `https://api.helium.io/v1/hotspots/${address}/activity`
        let data = []
        while (getLength(data) < page * size) {
            const payload = await axios.get(link)
            if (payload && getLength(payload.data.data)) {
                const cursor = payload.data.cursor
                link = `https://api.helium.io/v1/hotspots/${address}/activity?cursor=${cursor}`
                data = [...data, ...payload.data.data]
            }
        }
        return data.slice((page - 1) * size, page * size)
    }

    static async postGateWayKardia(address, page, size) {
        const link = `https://backend.kardiachain.io/api/v1/addresses/${address}/txs?page=${page}&limit=${size}`

        const fetch = await axios.get(link)

        const data = fetch.data.data
        return data.data
    }

    static async postGateWayKardiaTokens(address, page, size, token) {
        let currentPage = 1
        const link = `https://backend.kardiachain.io/api/v1/token/txs?address=${address}&page=${currentPage}&limit=100`
        const arrTokensTxs = []
        while (arrTokensTxs.length < page * size) {
            const fetch = await axios.get(link)
            if (fetch.data) {
                const arrTxs = fetch.data.data.data
                arrTxs.reduce((chain, item, index) => {
                    if (item.tokenAddress === token) {
                        arrTokensTxs.push(item)
                    }
                }, [])
            }
            currentPage++

            if (currentPage * 100 > fetch.data.data.total) {
                break
            }
        }
        return arrTokensTxs.slice((page - 1) * size, page * size)
    }

    static async postGateWayElrond(address, page, size) {
        const link = `https://beta-api.elrond.com/transactions?from=${(page - 1) * size}&size=${page * size}&sender=${address}&receiver=${address}&condition=should&fields=txHash,receiver,receiverShard,sender,senderShard,status,timestamp,value`
        const res = await axios.get(link)

        if (res) {
            return res.data
        } else {
            return []
        }
    }

    static async postGateWayBinance(address, page, size, asset) {
        const link = `https://explorer.binance.org/api/v1/txs?page=${page}&rows=${size}&address=${address}&asset=${asset}`
        const data = await fetchAPI(link)
        return data
    }

    static async postGateWayNear(address, page, token) {
        if (token) {
            const link = `https://api.nearblocks.io/v1/account/${token}/txns?from=${address}&order=desc&page=${page}&per_page=25`
            const data = await fetchAPI(link)

            if (data && getLength(data.txns) > 0) {
                return data.txns.map(txs => {
                    const isTransfer = txs.actions.find(at => at.method === 'ft_transfer')
                    return {
                        hash: txs.transaction_hash,
                        signerId: txs.predecessor_account_id,
                        receiverId: txs.receiver_account_id,
                        blockTimestamp: Math.round(txs.block_timestamp / 1000000),
                        amount: isTransfer ? txs.actions_agg.deposit : 0
                    }
                })
            }
            return []
        }
        const link = `https://nearscan-api.octopus-network.workers.dev/txns/${address}/${page}/50`
        const data = fetchAPI(link)
        if (data) {
            return data
        }
        return []
    }

    static async postGateWayAvaxX(address, page, size) {
        return []
    }

    static async postGateWayAvaxXSingleAddress(address, page, size) {
        const link = `https://explorerapi.avax.network/v2/transactions?address=${address}&sort=timestamp-desc&limit=1000`

        const payload = await axios.get(link)

        if (payload.data && payload.data.transactions) {
            return payload.data.transactions.filter(it => it.chainID === '2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM').slice((page - 1) * size, page * size)
        } else {
            return []
        }
    }

    static async postGateWayBand(address, page, size) {
        let currentFrom = 0
        const fetchTime = page * size / 50
        let arrTxs = []

        for (let index = 0; index < fetchTime; index++) {
            const serverUrl = `https://api-band.cosmostation.io/v1/account/new_txs/${address}?from=${currentFrom}&limit=50`
            const response = await axios.get(serverUrl)

            if (getLength(response.data) > 0) {
                arrTxs = [...arrTxs, ...response.data]
                currentFrom = response.data[response.data.length - 1].header.id
            }
        }

        if (getLength(arrTxs) > 0) {
            return arrTxs.slice((page - 1) * size, page * size)
        }
        return null
    }

    static async postGateWayTerra(address, page, limit = 100) {
        let offset = 0
        let isMax = false
        let i = 1
        let response
        let responseJson

        while (i <= page && !isMax) {
            const serverUrl = `https://fcd.terra.dev/v1/txs?offset=${offset}&limit=${limit}&account=${address}&chainId=columbus-4`
            response = await fetch(serverUrl)
            responseJson = await response.json()
            if (responseJson.next) {
                i++
                offset = responseJson.next
            } else {
                isMax = true
            }
        }

        if (response.status === 200) {
            return responseJson
        }
        return null
    }

    static async postGateWayTron(address, page, limit, contractAddress) {
        try {
            let serverUrl = `https://apilist.tronscan.org/api/transfer?sort=-timestamp&count=true&limit=${limit}&start=${page}&address=${address}&tokens=_`

            if (contractAddress) {
                serverUrl = `https://apilist.tronscan.org/api/token_trc20/transfers?limit=${limit}&start=${page}&sort=-timestamp&count=true&tokens=${contractAddress}&relatedAddress=${address}`
            }

            const params = {
                method: REQUEST_TYPE.GET,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            }

            var response = await fetch(serverUrl, params)
            const responJson = await response.json()

            if (response.status === 200) {
                return contractAddress ? responJson.token_transfers : responJson.data
            }

            if (response.status === 400) {
                return null
            }
            return null
        } catch (error) {
            return null
        }
    }

    static async postGateWayOkex(address, page, size, tokenAddress) {
        const time = new Date().getTime()
        let link = `https://www.oklink.com/api/explorer/v1/okexchain/addresses/${address}/transactions/condition?t=${time}&offset=${(page - 1) * size}&limit=${size}`
        if (tokenAddress) {
            link = `https://www.oklink.com/api/explorer/v1/okexchain/addresses/${address}/transfers/condition?t=${time}&offset=${(page - 1) * size}&limit=${size}&tokenAddress=${tokenAddress}&tokenType=OIP20`
        }

        const payload = await axios.get(link)

        if (payload.data) {
            return payload.data.data
        } else {
            return []
        }
    }

    static async postGateWayThor(address, page) {
        try {
            const serverUrl = `https://api.viewblock.io/thorchain/addresses/${address}?network=chaosnet&page=${page}`
            const params = {
                method: REQUEST_TYPE.GET,
                headers: {
                    Origin: 'https://viewblock.io',
                    Accept: 'application/json'
                }
            }
            const response = await fetch(serverUrl, params)
            const responseJson = await response.json()
            if (response.status === 200) {
                return responseJson.txs.docs
            }
            return null
        } catch (err) {
            return null
        }
    }

    static async postGateWayFunctionX(address, page, size) {
        try {
            const serverUrl = 'https://explorer.functionx.io/explorer/graphql'
            const params = {
                method: REQUEST_TYPE.POST,
                body: JSON.stringify({
                    query: `{\n  txPage(chainId: null, height: null, operateAddress: null, accountAddress: "${address}", page: { index: ${page}, size: ${size} }) {\n  txs {\n  txTime\n hash\n  msgs {\n  amount\n  symbol\n  from\n to\n  }\n  result\n }\n  }\n}`
                })
            }

            const response = await fetch(serverUrl, params)

            const responseJson = await response.json()

            if (getLength(responseJson.data.txPage.txs) > 0) {
                const data = responseJson.data.txPage.txs.map(it => {
                    const msgx = it.msgs[0]

                    return {
                        hash: it.hash,
                        from: msgx.from,
                        to: msgx.to,
                        amount: convertWeiToBalance(msgx.amount),
                        timestamp: it.txTime

                    }
                })
                return data
            }

            return []
        } catch (error) {
            // clog('FunctionX history error ', error)
            return []
        }
    }

    static async postGateWayComos(address, page, size) {
        try {
            const fetchTime = page * size / 50
            let arrTxs = []
            let currentFrom = 0

            for (let index = 0; index < fetchTime; index++) {
                const serverUrl = `https://api.cosmostation.io/v1/account/new_txs/${address}?from=${currentFrom}&limit=50`
                const response = await fetch(serverUrl)

                const responseJson = await response.json()
                if (getLength(responseJson) > 0) {
                    arrTxs = [...arrTxs, ...responseJson]
                    currentFrom = responseJson[responseJson.length - 1].header.id
                } else {
                    break
                }
            }

            if (getLength(arrTxs) > 0) {
                return arrTxs.slice((page - 1) * size, page * size)
            }
            return null
        } catch (error) {
            return null
        }
    }

    static async postGateWayPolkadot(address, page, size, chain) {
        try {
            const serverUrl = `https://explorer-32.polkascan.io/api/v1/${chain}/extrinsic?filter[address]=${address}&page[size]=${size}&page[num]=${page}`
            const serverUrlTransfer = `https://explorer-32.polkascan.io/api/v1/${chain}/balances/transfer?filter[address]=${address}&page[size]=${size}&page[num]=${page}`

            var response = await fetch(serverUrl)
            var responseTransfer = await fetch(serverUrlTransfer)

            const responJson = await response.json()
            const responJsonTransfer = await responseTransfer.json()

            if (response.status === 200) {
                return { data: responJson.data, transfer: responJsonTransfer.data }
            }

            if (response.status === 400) {
                return null
            }
            return null
        } catch (error) {
            return null
        }
    }

    static async postGateWayThetaNetwork(address: string, chain: string, token?: any, page?: any, size?: any) {
        try {
            const isGetToken = getLength(token) > 0
            if (isGetToken) {
                const currPage = 1
                const url = `https://explorer.thetatoken.org:8443/api/account/tokenTx/${address}?type=TNT-20&pageNumber=${currPage}&limit=100`
                let arrTokenTxs = []
                while (getLength(arrTokenTxs) < parseInt(page) * parseInt(size)) {
                    const response = await fetch(url)
                    const responseJson = await response.json()

                    const arrFetchTokenTxs = responseJson.body.filter(it => it.contract_address === lowerCase(token))
                    arrTokenTxs = arrTokenTxs.concat(arrFetchTokenTxs)
                    const totalPage = responseJson.totalPageNumber

                    if (currPage === totalPage) break
                }
                const arrFinalTokenTxs = arrTokenTxs.slice((parseInt(page) - 1) * parseInt(size), parseInt(page) * parseInt(size))

                if (getLength(arrFinalTokenTxs) === 0) {
                    return []
                }

                return arrFinalTokenTxs.map(it => {
                    return {
                        hash: it.hash,
                        from: it.from,
                        to: it.to,
                        timestamp: it.timestamp,
                        amount: convertWeiToBalance(it.value, 18)
                    }
                })
            } else {
                const url = `https://explorer.thetatoken.org:8443/api/accounttx/${address}?type=-1&pageNumber=${page}&limitNumber=${size}&isEqualType=true&types=["2","7"]`
                const response = await fetch(url)
                const responseJson = await response.json()
                const finalData = responseJson.body.map((it, index) => {
                    const isGetFirst = it.type === 2
                    const getValue = chain === chainType.theta ? 'thetawei' : 'tfuelwei'
                    if (!isGetFirst) {
                        const foundValue = Object.values<any>(it.data).filter(data => data.address).find(data => lowerCase(data.address) === lowerCase(address))
                        const fromData = (it.data.from)
                        const toData = (it.data.to)
                        return {
                            hash: it.hash,
                            timeStamp: it.timestamp,
                            from: fromData.address,
                            to: toData.address,
                            amount: convertWeiToBalance(foundValue.coins[getValue], 18)
                        }
                    } else {
                        const foundValue = Object.values(it.data).filter(data => (data[0] && data[0].address)).find(data => lowerCase(data[0].address) === lowerCase(address))
                        const fromData = it.data.inputs[0]
                        const toData = it.data.outputs[0]
                        return {
                            hash: it.hash,
                            timeStamp: it.timestamp,
                            from: fromData.address,
                            to: toData.address,
                            amount: convertWeiToBalance(foundValue[0].coins[getValue], 18)
                        }
                    }
                })
                return finalData
            }
        } catch (error) {
            return []
        }
    }

    static async postGateWayPlaton(address, token, page, size) {
        const isGetToken = getLength(token) > 0

        if (isGetToken) {
            const currPage = 1
            const url = 'https://scan.platon.network/browser-server/token/arc20-tx/list'
            let arrTokenTxs = []
            while (getLength(arrTokenTxs) < parseInt(page) * parseInt(size)) {
                const payload = await axios.post(url, { pageNo: currPage, pageSize: 10, txType: '', address: address })

                const arrFetchTokenTxs = payload.data.data.filter(it => it.contract === lowerCase(token))
                arrTokenTxs = arrTokenTxs.concat(arrFetchTokenTxs)
                const totalPage = payload.data.totalPages

                if (currPage === totalPage) break
            }
            const arrFinalTokenTxs = arrTokenTxs.slice((parseInt(page) - 1) * parseInt(size), parseInt(page) * parseInt(size))

            if (getLength(arrFinalTokenTxs) === 0) {
                return []
            }

            return arrFinalTokenTxs.map(it => {
                return {
                    hash: it.txHash,
                    from: it.txFrom,
                    to: it.transferTo,
                    timestamp: it.blockTimestamp,
                    amount: it.value
                }
            })
        } else {
            const url = 'https://scan.platon.network/browser-server/transaction/transactionListByAddress'
            const payload = await axios.post(url, { pageNo: page, pageSize: size, txType: '', address: address })

            return payload.data.data.map(it => {
                return {
                    hash: it.txHash,
                    from: it.from,
                    to: it.to,
                    timestamp: it.timestamp,
                    value: it.value
                }
            })
        }
    }

    static async postGateWayCasper(address, page, size) {
        const convertAddress = Buffer.from(
            uint8ArrayPkToAccountHash(publicKeyFromPkHex(address))
        ).toString('hex')

        const url = `https://event-store-api-clarity-mainnet.make.services/accounts/${convertAddress}/transfers?page=${page}&limit=${size}&with_extended_info=1`

        const response = await fetch(url)
        const responseJson = await response.json()

        return responseJson.data.map(it => {
            return {
                hash: get(it, 'deployHash', ''),
                from: get(it, 'fromAccountPublicKey', ''),
                to: get(it, 'toAccountPublicKey', ''),
                timeStamp: get(it, 'timestamp', ''),
                amount: convertWeiToBalance(get(it, 'amount', ''), 9)
            }
        })
    }

    static async postGateWayTon(address, page, size) {
        const url = `https://toncenter.com/api/v2/getTransactions?address=${address}&limit=${page * size}&to_lt=0&archival=false`

        const response = await fetch(url)
        const responseJson = await response.json()

        return responseJson.result.slice((parseInt(page) - 1) * parseInt(size), parseInt(page) * parseInt(size)).map(it => {
            return {
                hash: get(it, '.transaction_id.hash', ''),
                from: get(it, '.in_msg.source', ''),
                to: get(it, '.in_msg.destination', ''),
                timeStamp: get(it, 'utime', ''),
                amount: convertWeiToBalance(get(it, '.in_msg.value', ''), 9)
            }
        })
    }

    static async postGateWayEther(action, queryStr = '', chain) {
        try {
            const serverUrl = LINK_EXPLORER_API[chain]
            const params = {
                method: REQUEST_TYPE.GET,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            }
            var response = await fetch(serverUrl + action + queryStr, params)
            const responJson = await response.json()
            if (response.status === 200) {
                return responJson
            }

            if (response.status === 400) {
                return responJson
            }
            return null
        } catch (error) {
            return null
        }
    }

    static async postGateWay(url: string, method = REQUEST_TYPE.GET, body?: any, queryBody?: any) {
        try {
            const params: Record<string, any> = {
                method,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            }

            if (body) {
                params.body = JSON.stringify(body)
            }

            let queryStr = ''

            if (queryBody) {
                queryStr = '?' + QueryString.stringify(queryBody)
            }
            const response = await fetch('https://tomoscan.io/api/' + url + queryStr, params)
            const responJson = await response.json()
            if (response.status === 200) {
                return responJson.data
            }

            if (response.status === 400) {
                return responJson
            }
            return null
        } catch (error) {
            return null
        }
    }

    static async formatTransactionV2Cosmos(arrTxs, usrAddr) {
        return arrTxs.map(it => {
            const stateOutput: Record<string, any> = {
                chain: chainType.cosmos,
                input: '',
                timeStatmp: (new Date(it.header.timestamp)).getTime() / 1000,
                hash: it.data.txhash
            }
            const arrMessages = it.data.tx.body.messages
            const foundMessage = it.data.tx.body.messages.find(it => (it.from_address === usrAddr || it.to_address === usrAddr || it.validator_address === usrAddr || it.delegator_address === usrAddr))
            stateOutput.tx = it.data.tx.body.messages[0]
            const txType = arrMessages[0]['@type'].split('.')[3]
            stateOutput.type = 'callContract'

            switch (txType) {
                case 'MsgSend': {
                    const from = foundMessage.from_address
                    const to = foundMessage.to_address
                    stateOutput.type = from === to ? 'self' : (usrAddr === from ? 'send' : 'receive')
                    stateOutput.from = from
                    stateOutput.to = to
                    stateOutput.amount = convertWeiToBalance(foundMessage.amount[0].amount, 6)
                    break
                }
                case 'MsgSwapWithinBatch': {
                    stateOutput.type = 'swap'
                    stateOutput.from = usrAddr
                    stateOutput.amount = convertWeiToBalance(it.data.tx.body.messages[0].offer_coin.amount, 6)
                    break
                }
                case 'MsgDepositWithinBatch': {
                    const depositeAtom = it.data.tx.body.messages[0].deposit_coins.find(it => it.denom === 'uatom')
                    stateOutput.type = 'depositWithinBatch'
                    stateOutput.from = usrAddr
                    stateOutput.amount = convertWeiToBalance(depositeAtom ? depositeAtom.amount : 0, 6)
                    break
                }
                case 'MsgVote': {
                    stateOutput.from = usrAddr
                    break
                }
                default: {
                    const from = foundMessage ? foundMessage.delegator_address : it.data.tx.body.messages[0].delegator_address
                    const to = foundMessage ? foundMessage.validator_address : it.data.tx.body.messages[0].validator_address
                    const amount = foundMessage ? foundMessage.amount[0] ? foundMessage.amount[0].amount : foundMessage.amount ? foundMessage.amount.amount : 0 : 0
                    stateOutput.from = from
                    stateOutput.to = to
                    stateOutput.amount = convertWeiToBalance(amount, 6)
                }
            }
            return stateOutput
        })
    }

    static async formatTransactionV2Kava(arrTxs, usrAddr) {
        return arrTxs.map(it => {
            const stateOutput: Record<string, any> = {
                chain: chainType.kava,
                input: '',
                timeStatmp: (new Date(it.header.timestamp)).getTime() / 1000,
                hash: it.data.txhash,
                type: 'callContract'
            }
            const type = it.data.tx.value.msg[0].type.split('/')[1]
            stateOutput.txType = type
            stateOutput.tx = it.data.tx.value.msg[0].value
            const message = it.data.tx.value.msg[0].value
            switch (type) {
                case 'MsgSend': {
                    stateOutput.type = message.from_address === message.to_address ? 'self' : (usrAddr === message.from_address ? 'send' : 'receive')
                    stateOutput.from = message.from_address
                    stateOutput.to = message.to_address
                    stateOutput.amount = convertWeiToBalance(message.amount[0].amount, 6)
                    break
                }
                case 'MsgRepayDeb': {
                    const amount = message.payment.amount
                    stateOutput.from = message.sender
                    stateOutput.amount = convertWeiToBalance(amount, 6)
                    break
                }
                default: {
                    const from = message.delegator_address || message.sender || message.depositor
                    const to = message.validator_address
                    const amount = message.amount ? message.amount[0] ? message.amount[0].amount : message.amount.amount : 0
                    stateOutput.from = from
                    stateOutput.to = to
                    stateOutput.amount = convertWeiToBalance(amount, 6)
                }
            }

            return stateOutput
        })
    }

    static async postGateWayAncient8(address, token, page, size) {
        if (token) {
            const totalSize = parseInt(page) * parseInt(size)
            let isEnd = false
            let arrTransaction = []
            while (!isEnd) {
                let fromBlock = 0
                let index = 0

                let url = `https://scan.ancient8.gg/api/v2/addresses/${address}/token-transfers?token=${token}`

                if (fromBlock) {
                    url = `https://scan.ancient8.gg/api/v2/addresses/${address}/token-transfers?token=${token}?block_number=${fromBlock}&index=${index}`
                }

                const payload = await axios.get(url).catch(() => ({}))
                arrTransaction = arrTransaction.concat(get(payload, 'data.items', []))
                fromBlock = get(payload, 'data.next_page_params.block_number', 0)
                index = get(payload, 'data.next_page_params.index', index)

                if (getLength(arrTransaction) >= totalSize || getLength((get(payload, 'data.items', []))) < 50) {
                    isEnd = true
                }
            }

            const paginateData = arrTransaction.slice((page - 1) * size, page * size).map(it => {
                return {
                    from: it.from.hash,
                    to: it.to.hash,
                    timestamp: moment(it.timestamp).unix(),
                    hash: it.tx_hash,
                    value: it.total.value
                }
            })
            const formatTx = await mapLimit(paginateData, 10, async (tx) => {
                const payload = await axios.get(`https://scan.ancient8.gg/api/v2/transactions/${tx.hash}`)

                const txData = get(payload, 'data', false)
                if (txData) {
                    return Object.assign({
                        nonce: txData.nonce,
                        gasPrice: txData.gas_price,
                        status: txData.status,
                        input: txData.raw_input,
                        gasUsed: txData.gas_used
                    }, tx)
                }
                return tx
            })
            return formatTx
        } else {
            const totalSize = parseInt(page) * parseInt(size)
            let isEnd = false
            let arrTransaction = []
            while (!isEnd) {
                let fromBlock = 0
                let index = 0

                let url = `https://scan.ancient8.gg/api/v2/addresses/${address}/transactions`

                if (fromBlock) {
                    url = `https://scan.ancient8.gg/api/v2/addresses/${address}/transactions?block_number=${fromBlock}&index=${index}`
                }
                const payload = await axios.get(url).catch(() => ({}))
                arrTransaction = arrTransaction.concat(get(payload, 'data.items', []))
                fromBlock = get(payload, 'data.next_page_params.block_number', 0)
                index = get(payload, 'data.next_page_params.index', 0)

                if (getLength(arrTransaction) >= totalSize || getLength((get(payload, 'data.items', []))) < 50) {
                    isEnd = true
                }
            }

            const paginateData = arrTransaction.slice((page - 1) * size, page * size).map(it => {
                return {
                    blockNumber: it.blockNumber,
                    timeStamp: moment(it.timestamp).unix(),
                    hash: it.hash,
                    nonce: it.nonce,
                    transactionIndex: it.position,
                    from: it.from.hash,
                    to: it.to.hash,
                    value: it.value,
                    gasPrice: it.gas_price,
                    status: it.status,
                    input: it.raw_input,
                    contractAddress: it.contractAddress,
                    gasUsed: it.gas_used,
                    date: it.timestamp
                }
            })
            return paginateData
        }
    }

    static async postGateWayAncient8Testnet(address, token, page, size) {
        if (token) {
            const totalSize = parseInt(page) * parseInt(size)
            let isEnd = false
            let arrTransaction = []
            while (!isEnd) {
                let fromBlock = 0
                let index = 0

                let url = `https://scanv2-testnet.ancient8.gg/api/v2/addresses/${address}/token-transfers?token=${token}`

                if (fromBlock) {
                    url = `https://scanv2-testnet.ancient8.gg/api/v2/addresses/${address}/token-transfers?token=${token}?block_number=${fromBlock}&index=${index}`
                }

                const payload = await axios.get(url).catch(() => ({}))
                arrTransaction = arrTransaction.concat(get(payload, 'data.items', []))
                fromBlock = get(payload, 'data.next_page_params.block_number', 0)
                index = get(payload, 'data.next_page_params.index', index)

                if (getLength(arrTransaction) >= totalSize || getLength((get(payload, 'data.items', []))) < 50) {
                    isEnd = true
                }
            }

            const paginateData = arrTransaction.slice((page - 1) * size, page * size).map(it => {
                return {
                    from: it.from.hash,
                    to: it.to.hash,
                    timestamp: moment(it.timestamp).unix(),
                    hash: it.tx_hash,
                    value: it.total.value
                }
            })
            const formatTx = await mapLimit(paginateData, 10, async (tx) => {
                const payload = await axios.get(`https://scanv2-testnet.ancient8.gg/api/v2/transactions/${tx.hash}`)

                const txData = get(payload, 'data', false)
                if (txData) {
                    return Object.assign({
                        nonce: txData.nonce,
                        gasPrice: txData.gas_price,
                        status: txData.status,
                        input: txData.raw_input,
                        gasUsed: txData.gas_used
                    }, tx)
                }
                return tx
            })
            return formatTx
        } else {
            const totalSize = parseInt(page) * parseInt(size)
            let isEnd = false
            let arrTransaction = []
            while (!isEnd) {
                let fromBlock = 0
                let index = 0

                let url = `https://scanv2-testnet.ancient8.gg/api/v2/addresses/${address}/transactions`

                if (fromBlock) {
                    url = `https://scanv2-testnet.ancient8.gg/api/v2/addresses/${address}/transactions?block_number=${fromBlock}&index=${index}`
                }
                const payload = await axios.get(url).catch(() => ({}))
                arrTransaction = arrTransaction.concat(get(payload, 'data.items', []))
                fromBlock = get(payload, 'data.next_page_params.block_number', 0)
                index = get(payload, 'data.next_page_params.index', 0)

                if (getLength(arrTransaction) >= totalSize || getLength((get(payload, 'data.items', []))) < 50) {
                    isEnd = true
                }
            }

            const paginateData = arrTransaction.slice((page - 1) * size, page * size).map(it => {
                return {
                    blockNumber: it.blockNumber,
                    timeStamp: moment(it.timestamp).unix(),
                    hash: it.hash,
                    nonce: it.nonce,
                    transactionIndex: it.position,
                    from: it.from.hash,
                    to: it.to.hash,
                    value: it.value,
                    gasPrice: it.gas_price,
                    status: it.status,
                    input: it.raw_input,
                    contractAddress: it.contractAddress,
                    gasUsed: it.gas_used,
                    date: it.timestamp
                }
            })
            return paginateData
        }
    }

    static async postGateWayCoreDao(address, token, page, size) {
        if (token) {
            const payload = await axios({
                method: 'POST',
                url: 'https://scan.coredao.org/api/chain/token_transfer',
                data: {
                    addressHash: token,
                    pageSize: size,
                    pageNum: page,
                    tokenPage: true,
                    eip: 20,
                    searchParam: address
                }
            })

            const formatData = get(payload, 'data.data.records', []).map(it => {
                return {
                    blockNumber: it.blockNumber,
                    timeStamp: moment(it.timestamp).unix(),
                    hash: it.txnHash,
                    nonce: it.nonce,
                    blockHash: it.blockHash,
                    transactionIndex: it.transactionIndex,
                    from: it.fromHash,
                    to: it.toHash,
                    value: it.value,
                    input: it.inputData || '0x',
                    contractAddress: it.tokenAddressHash,
                    gasUsed: it.gasUsed,
                    date: it.timestamp
                }
            })

            return formatData
        } else {
            const payload = await axios({
                method: 'POST',
                url: 'https://scan.coredao.org/api/chain/address_transaction',
                data: { addressHash: address, pageSize: size, pageNum: page }
            })

            const formatData = get(payload, 'data.data.records', []).map(it => {
                return {
                    blockNumber: it.blockNumber,
                    timeStamp: moment(it.timestamp).unix(),
                    hash: it.hash,
                    nonce: it.nonce,
                    blockHash: it.blockHash,
                    transactionIndex: it.transactionIndex,
                    from: it.fromHash,
                    to: it.toHash,
                    value: it.value,
                    isError: it.status ? '0' : '1',
                    txreceipt_status: it.status ? '0' : '1',
                    input: it.inputData || '0x',
                    contractAddress: it.contractAddress,
                    date: it.timestamp
                }
            })

            return formatData
        }
    }
}
