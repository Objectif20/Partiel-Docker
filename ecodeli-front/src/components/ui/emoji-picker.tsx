import React, { useState } from 'react';
import {EmojiPicker} from "@ferrucc-io/emoji-picker";


interface EmojiPickerComponentProps {
  onEmojiSelect: (emoji: string) => void;
}

const EmojiPickerComponent: React.FC<EmojiPickerComponentProps> = ({ onEmojiSelect }) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    setShowPicker(false);
  };

  return (
    <div className="relative">
      <button onClick={() => setShowPicker(!showPicker)}>
        😃
      </button>
      {showPicker && (
        <EmojiPicker
          className="w-[300px] border-none absolute z-10"
          emojisPerRow={9}
          emojiSize={36}
          onEmojiSelect={handleEmojiClick}
        >
          <EmojiPicker.Header>
            <EmojiPicker.Input
              placeholder="Search all emoji"
              className="h-[36px] w-full rounded-[8px] text-[15px] focus:shadow-[0_0_0_1px_#1d9bd1,0_0_0_6px_rgba(29,155,209,0.3)] dark:focus:shadow-[0_0_0_1px_#1d9bd1,0_0_0_6px_rgba(29,155,209,0.3)] focus:border-transparent focus:outline-none mb-1"
              hideIcon
            />
          </EmojiPicker.Header>
          <EmojiPicker.Group>
            <EmojiPicker.List containerHeight={320} />
          </EmojiPicker.Group>
          <EmojiPicker.Preview>
            {({ previewedEmoji }) => (
              <>
                {previewedEmoji ? (
                  <EmojiPicker.Content />
                ) : (
                  <button>Add Emoji</button>
                )}
                <EmojiPicker.SkinTone />
              </>
            )}
          </EmojiPicker.Preview>
        </EmojiPicker>
      )}
    </div>
  );
};

export default EmojiPickerComponent;
