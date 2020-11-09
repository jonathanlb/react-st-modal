import React, { useState } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import { CustomDialog, useDialog } from '../src/index';

afterEach(() => {
    // cleanup doesn't seem to unmount testing components, otherwise
    document.body.innerHTML = '';
});

interface Trigger {
    isOk: number;
}

// The element to be shown in the modal window
function CustomDialogContent() {
  // use this hook to control the dialog
  const dialog = useDialog();
 
  const [value, setValue] = useState<string>();
 
  return (
    <div>
      <input
        type="text"
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
      <button
        onClick={() => {
          // Сlose the dialog and return the value
          dialog.close(value);
        }}
      >
        Custom button
      </button>
    </div>
  );
}

function CustomExample() {
  return (
    <div>
      <button
        onClick={async () => {
          const result = await CustomDialog(
            <CustomDialogContent />,
            {
              title: 'Custom Dialog',
              showCloseIcon: true,
            }
          );
        }}
      >
        Custom
      </button>
    </div>
  );
}

describe('Demonstrate custom dialog features', () => {
    test('executes confirm', async () => {
      render(CustomExample());
      expect(screen.queryByRole('dialog')).toBeNull();
      await waitFor(() => fireEvent.click(screen.getByText('Custom')));

      const dialog = await waitFor(() => screen.getByRole('dialog'));
      await waitFor(() => fireEvent.click(screen.getByText('Custom button')));

      expect(screen.queryByRole('dialog')).toHaveClass('modalHidden');
    });
});
