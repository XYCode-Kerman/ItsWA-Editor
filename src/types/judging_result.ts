import { Checkpoint, Status } from "./ccf"



export interface ProblemResult {
    ckpt: Checkpoint,
    score: number,
    status: Status
}

export interface PlayerResult {
    player_order: string,
    problems_result: {
        [key: string]: ProblemResult[]
    }
}

export type JudgingResult = PlayerResult[]