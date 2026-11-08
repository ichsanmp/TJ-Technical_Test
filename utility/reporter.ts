import type { Reporter, TestCase, TestResult, TestStep } from '@playwright/test/reporter';

// 0 = hanya step di spec (Given/When/Then), 1 = ikut sub-step dari page object
const MAX_DEPTH = 0;

type Item = { title: string; depth: number; ms: number; failed: boolean };

const isStep = (s: TestStep) => s.category === 'test.step';

function depthOf(step: TestStep) {
    let depth = 0;
    for (let p = step.parent; p; p = p.parent) {
        if (isStep(p)) depth++;
    }
    return depth;
}

function time(ms: number) {
    return ms < 1000 ? `${ms} ms` : `${(ms / 1000).toFixed(1)} s`;
}

class ChecklistReporter implements Reporter {
    private runs = new Map<string, Item[]>();
    private items = new Map<TestStep, Item>();

    private key(test: TestCase, result: TestResult) {
        return `${test.id}-${result.retry}`;
    }

    onTestBegin(test: TestCase, result: TestResult) {
        this.runs.set(this.key(test, result), []);
    }

    onStepBegin(test: TestCase, result: TestResult, step: TestStep) {
        if (!isStep(step) || depthOf(step) > MAX_DEPTH) return;

        const item = { title: step.title, depth: depthOf(step), ms: 0, failed: false };
        this.items.set(step, item);
        this.runs.get(this.key(test, result))?.push(item);
    }

    onStepEnd(_test: TestCase, _result: TestResult, step: TestStep) {
        const item = this.items.get(step);
        if (!item) return;
        item.ms = step.duration;
        item.failed = !!step.error;
    }

    onTestEnd(test: TestCase, result: TestResult) {
        const items = this.runs.get(this.key(test, result)) ?? [];

        console.log(`\n${test.title}`);
        for (const item of items) {
            const mark = item.failed ? '✗' : '✓';
            console.log(`${'  '.repeat(item.depth + 1)}${mark} ${item.title} (${time(item.ms)})`);
        }
        console.log(`  -> ${result.status} (${time(result.duration)})`);

        if (result.status !== 'passed' && result.error?.message) {
            const firstLine = result.error.message.replace(/\u001b\[[0-9;]*m/g, '').split('\n')[0];
            console.log(`  ${firstLine}`);
        }
    }
}

export default ChecklistReporter;