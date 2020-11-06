import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import { Confirm } from '../src/index';

afterEach(() => {
    // cleanup doesn't seem to unmount testing components, otherwise
    document.body.innerHTML = '';
});

interface Trigger {
    isOk: number;
}

function createConfirmationDialog(trigger: Trigger) {
    // widget more or less copied from example in README
    return (
        <div>
            <button
                onClick={async () => {
                    const result = await Confirm('Сonfirmation text', 'Сonfirmation title');
                    if (result) {
                        trigger.isOk = 1;
                    } else {
                        trigger.isOk = -1;
                    }
                }}
            >
                Show confirm
            </button>
        </div>);
}

describe('Demonstrate Confirm dialog features', () => {
test('executes confirm', async () => {
    const trigger = { isOk: 0 };
    render(createConfirmationDialog(trigger));

    expect(trigger.isOk).toBe(0);
    expect(screen.queryByRole('dialog')).toBeNull(); // getByRole throws error expect cannot catch

    await waitFor(() => fireEvent.click(screen.getByText('Show confirm')));
    expect(trigger.isOk).toBe(0);

    const dialog = await waitFor(() => screen.getByRole('dialog'));
    expect(trigger.isOk).toBe(0);
   
    const okButton = screen.getByText('Ok');
    expect(okButton).toHaveClass('--primary');
    await waitFor(() => fireEvent.click(okButton));
    expect(trigger.isOk).toBe(1);

    expect(screen.queryByRole('dialog')).toHaveClass('modalHidden');
});

test('executes cancel', async () => {
    const trigger = { isOk: 0 };
    render(createConfirmationDialog(trigger));

    expect(trigger.isOk).toBe(0);
    expect(screen.queryByRole('dialog')).toBeNull(); // getByRole throws error expect cannot catch

    await waitFor(() => fireEvent.click(screen.getByText('Show confirm')));
    expect(trigger.isOk).toBe(0);

    const dialog = await waitFor(() => screen.getByRole('dialog'));
    expect(trigger.isOk).toBe(0);
   
    const cancelButton = screen.getByText('Cancel');
    expect(cancelButton).toHaveClass('--light');
    await waitFor(() => fireEvent.click(cancelButton));
    expect(trigger.isOk).toBe(-1);
});
});