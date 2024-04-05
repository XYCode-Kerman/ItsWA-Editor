export type Language = 'CPP' | 'C'
export type InputType = 'STDIN' | 'FILE'
export type OutputType = 'STDOUT' | 'FILE'
export type Status = 'AC' | 'WA' | 'CE' | 'RE' | 'TLE'

export interface Checkpoint {
    input: string,
    answer: string,
    input_type: InputType,
    output_type: OutputType,

    // 仅输入输出类型为 FILE 时使用
    input_file: string | null,
    output_file: string | null
}

export interface Problem {
    name: string,
    background: string,
    description: string,
    input_format: string,
    output_format: string,
    judge_config: {
        source_file_name: string,
        languages: Language[],
        checkpoints: Checkpoint[]
    }
}

export interface CCFHeader {
    name: string,
    path: string,
    description: string,
    contest_type: 'OI' | 'IOI',
    enable_oj: boolean
}

export interface CCF {
    header: CCFHeader,
    contest: {
        problems: Problem[],
        languages: Language[]
    }
}