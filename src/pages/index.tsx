import { useEffect, useState } from 'react';
import { styled } from 'styled-components';

const model = ['tiny', 'base', 'small', 'medium', 'large', 'large-v2'];

export default function Home() {
  const [value, setValue] = useState(null);
  const models = [
    { name: 'tiny', value: 1 },
    { name: 'base', value: 2 },
    { name: 'small', value: 3 },
    { name: 'medium', value: 4 },
    { name: 'large', value: 5 },
    { name: 'large-v2', value: 6 },
  ];

  return (
    <Block>
      <Description>
        <Text>Whisper is a general-purpose speech recognition model.</Text>
        <Text>
          It is trained on a large dataset of diverse audio and is also a
          multi-task model that can perform multilingual speech recognition as
          well as speech translation and language identification.
        </Text>
        <Text>
          For longer audio files (&#62;10 minutes) not in English, it is
          recommended that you select Silero VAD (Voice Activity Detector) in
          the VAD option.
        </Text>
      </Description>
      <ModelContainer>
        <Text>Model</Text>
        <ModelSelector>
          {models.map((model) => {
            return <ModelButton>{model.name}</ModelButton>;
          })}
        </ModelSelector>
      </ModelContainer>
    </Block>
  );
}

const Description = styled.div`
  width: 450px;
  padding: 10px 12px;
  gap: 5px;
  display: flex;
  flex-direction: column;
`;

const Block = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Text = styled.div`
  font-size: 14px;
  font-weight: 100;
`;

const ModelContainer = styled.div`
  width: 380px;
  height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 10px;
  gap: 5px;
`;

const ModelSelector = styled.div`
  display: flex;
  width: auto;
`;

const ModelButton = styled.div`
  width: auto;
  font-size: 10px;
  font-weight: 900;
  padding: 10px;
  border-color: #80808076;
  border-width: 1px;
  border-style: solid;

  &:first-child {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }

  &:last-child {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  &:not(:last-child) {
    border-right: none;
  }
`;
