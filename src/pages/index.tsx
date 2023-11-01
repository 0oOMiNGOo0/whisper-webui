import {
  JSXElementConstructor,
  PromiseLikeOfReactNode,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
  useRef,
  useState,
  Fragment,
  ChangeEvent,
  MouseEvent,
  FormEvent,
  use,
  useMemo,
} from 'react';
import { styled } from 'styled-components';
import React from 'react';
import Axios from 'axios';
import Image from 'next/image';
import { Socket, io } from 'socket.io-client';
import { X509Certificate } from 'crypto';
import { ProgressBar } from '@tremor/react';

const models = [
  { name: 'tiny' },
  { name: 'base' },
  { name: 'small' },
  { name: 'medium' },
  { name: 'large' },
  { name: 'large-v2' },
];

interface Language {
  code: string;
  name: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
];

export default function Home(this: any) {
  const [fileStatus, setFileStatus] = useState<
    {
      isOK: boolean;
      fileName: string;
      uploadFile: File;
    }[]
  >([]);
  const [audioFile, setAudioFile] = useState<FileList | null>(null);
  const [selectedModel, setSelectedModel] = useState<number | null>(null);
  const [selectedFromLanguage, setSelectedFromLanguage] = useState<Language>(
    languages[1]
  );
  const [selectedToLanguage, setSelectedToLanguage] = useState<Language>(
    languages[1]
  );
  const fileInput = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(null);
  const [socket, setSocket] = useState<Socket>(null);

  const onModelClickHandler = (e: MouseEvent<HTMLDivElement>) => {
    const {
      dataset: { key },
    } = e.currentTarget;
    setSelectedModel(Number(key) ?? null);
  };

  const onLanguageFromClickHandler = (e: MouseEvent<HTMLDivElement>) => {
    const {
      dataset: { key },
    } = e.currentTarget;

    if (key) {
      setSelectedFromLanguage(languages[key] ?? null);
    }
  };

  const onLanguageToClickHandler = (e: MouseEvent<HTMLDivElement>) => {
    const {
      dataset: { key },
    } = e.currentTarget;
    setSelectedToLanguage(languages[key] ?? null);
  };

  const handleButtonClick = (e: any) => {
    if (fileInput.current != null) {
      fileInput.current.click();
    }
  };

  const handleChange = (e: any) => {
    console.log(e.target.files[0]);
  };

  const handleClearClick = (e: any) => {
    setSelectedModel(null);
    setSelectedFromLanguage(languages[1]);
    setSelectedToLanguage(languages[1]);
  };

  const onSubmitHandler = async (e: FormEvent) => {
    e.preventDefault();
    if (!(selectedModel + 1)) {
      alert('모델을 선택해주세요.');
      return;
    }
    const body = {
      selectedFromLanguage: selectedFromLanguage.code,
      selectedToLanguage: selectedToLanguage.code,
      selectedModel: models[selectedModel].name,
    };

    socket.emit('uploaded', body);

    console.log('REQUEST BODY DATA IS', body);
    // console.log('REQUEST DATA IS', data);
  };

  const task = useMemo(() => {
    if (selectedFromLanguage === selectedToLanguage) return 'transcribe';
    if (selectedFromLanguage !== selectedToLanguage) return 'translate';
  }, [selectedToLanguage, selectedFromLanguage]);

  const [progressValue, setProgressValue] = useState({
    current: 0,
    total: 0,
  });
  useEffect(() => {
    const socket = io('http://localhost:5050', {
      transports: ['websocket'],
    });
    // log socket connection
    socket.on('connect', () => {
      console.log('CONNECTED');
      setSocket(socket);
    });

    socket.on('message', (message: { current: number; total: number }) => {
      setProgressValue(message);
    });

    socket.on('downloads', (message: string[]) => {
      message.map((x) => {
        const name = x.replace('public', '');
        const downloadElement = document.createElement('a');
        downloadElement.download = name;
        downloadElement.href = name;
        downloadElement.textContent = name;
        downloadElement.classList.add('download_item');

        document.getElementById('download').append(downloadElement);
      });
      console.log(message);
    });

    socket.on('end', () => {
      console.log('EXIT');
      setTimeout(() => {
        setProgress(null);
      }, 1000);
    });

    // socket disconnect on component unmount if exists
    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  useEffect(() => {
    console.log(fileInput);
  }, [fileInput]);

  return (
    <>
      <Block1>
        <Block2 onSubmit={onSubmitHandler}>
          <Container>
            <Image
              src='/footer_logo.png'
              alt='footer_logo'
              width={500}
              height={50}
              style={{
                objectFit: 'contain',
                filter: 'invert(1)',
              }}
            />
          </Container>
          <Container>
            <Text>Model</Text>
            <ModelSelector>
              {models.map((model, i) => {
                return (
                  <ModelButton
                    className={`${selectedModel === i ? 'active' : ''}`}
                    onClick={onModelClickHandler}
                    data-key={i}
                  >
                    {model.name}
                  </ModelButton>
                );
              })}
            </ModelSelector>
          </Container>
          <Container>
            <Text>Language</Text>
            <SelectionWrapper>
              <SelectionWay>
                {languages.map((language, i) => {
                  return (
                    <ModelButton
                      className={`${
                        selectedFromLanguage === languages[i] ? 'active' : ''
                      }`}
                      onClick={onLanguageFromClickHandler}
                      data-key={i}
                    >
                      {language.name}
                    </ModelButton>
                  );
                })}
              </SelectionWay>
              <SelectionWay>
                {languages.map((language, i) => {
                  return (
                    <ModelButton
                      className={`${
                        selectedToLanguage === languages[i] ? 'active' : ''
                      }`}
                      onClick={onLanguageToClickHandler}
                      data-key={i}
                    >
                      {language.name}
                    </ModelButton>
                  );
                })}
              </SelectionWay>
              <TaskWrapper
                className={`${!!task && task}
              `}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: '5px',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Text>Transcribe</Text>
                  <Text>Translate</Text>
                </div>
                <Text>From</Text>
                <Text>
                  {!!selectedFromLanguage && selectedFromLanguage.name}
                </Text>
                <Text>To</Text>
                <Text>{!!selectedToLanguage && selectedToLanguage.name}</Text>
              </TaskWrapper>
            </SelectionWrapper>
          </Container>
          <Container>
            <Upload className={`${audioFile?.length > 0 ? 'active' : ''}`}>
              <Text>Upload</Text>
              <Button onClick={handleButtonClick}>파일 업로드</Button>
              <input
                type='file'
                onClick={handleChange}
                onChange={async (e) => {
                  const element = e.target as HTMLInputElement;

                  const fs = Array.from(element.files).map((x, i) => ({
                    isOK: false,
                    fileName: `${i}_${x.name}`,
                    uploadFile: x,
                  }));

                  await Promise.all([
                    fs.map(async (f) => {
                      const formData = new FormData();
                      Object.keys(f).forEach((key) =>
                        formData.append(key, f[key])
                      );

                      const { status } = await Axios.post(
                        'http://localhost:5050/uploaded',
                        formData,
                        {
                          headers: {
                            'Content-Type': 'multipart/form-data',
                          },
                          responseType: 'blob',
                        }
                      );

                      if (status === 200) {
                        setFileStatus((prevData) => {
                          const sData = prevData.map((x) => {
                            if (x.uploadFile === f.uploadFile) {
                              x.isOK = true;
                              return x;
                            } else {
                              return x;
                            }
                          });

                          return sData;
                        });
                      }
                    }),
                  ]);

                  setFileStatus(fs);
                }}
                ref={fileInput}
                style={{ display: 'none' }}
                multiple
              />
            </Upload>
            {fileStatus?.length > 0 && (
              <FileList>
                {Array.from(fileStatus).map((file, i) => (
                  <File key={i}>
                    {i + 1}. {file.uploadFile.name}
                    <Check>{` ${file.isOK ? 'OK' : 'NOT'}`}</Check>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='#000000'
                      height='7px'
                      width='7px'
                      version='1.1'
                      id='Capa_1'
                      viewBox='0 0 460.775 460.775'
                      style={{
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        let list = new DataTransfer();

                        setFileStatus((prevData) =>
                          prevData.filter(
                            (x) => x.uploadFile != file.uploadFile
                          )
                        );
                      }}
                    >
                      <path d='M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55  c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55  c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505  c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55  l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719  c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z' />
                    </svg>
                  </File>
                ))}
              </FileList>
            )}
          </Container>
          <progress
            value={progressValue.current}
            max={progressValue.total}
            style={{ transition: 'width 5s ease' }}
          />
          <Container>
            <ButtonWrapper>
              <Submit onClick={handleClearClick} type='reset'>
                Clear
              </Submit>
              <Submit type='submit'>Submit</Submit>
            </ButtonWrapper>
          </Container>
        </Block2>
        <Block2>
          <Container>
            <Text>Download</Text>
            <Download id='download'>
              <Text>파일이 생성되는 곳...</Text>
            </Download>
          </Container>
          <Container>
            <Text>Transcription</Text>
          </Container>
          <Container>
            <Text>Segments</Text>
          </Container>
        </Block2>
      </Block1>
    </>
  );
}

const Block1 = styled.div`
  justify-content: center;
  display: flex;
  padding: 300px 12px;
  gap: 15px;
`;

const Block2 = styled.form`
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 20px 14px;
  border-radius: 7px;
  border: 1px solid white;
  box-shadow: 0 0 16px 0px #00000017;
`;

const Text = styled.div`
  font-size: 12px;
  color: #3f51b5;
  font-weight: 600;
  padding: 3px 0px;
`;

const Container = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  padding: 10px;
`;

const ModelSelector = styled.div`
  display: flex;
  gap: 10px;
`;

const ModelButton = styled.div`
  text-align: center;
  font-size: 11px;
  font-weight: 700;
  padding: 13px;
  border: 1px solid #cfcfcf;
  border-radius: 50px;
  transition: background-color 350ms ease, border 350ms ease;

  &.active {
    background-color: #b5b5ec;
    color: #ffffff;
    background-color: #4050b5;
    border: 1px solid #4050b5;
  }
`;

const Button = styled.div`
  border: 1px solid #cfcfcf;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  color: gray;
  font-weight: 400;
  background-color: white;
`;

const SelectionWrapper = styled.div`
  width: 100%;
  gap: 10px;
  display: flex;
`;

const SelectionWay = styled.div`
  display: flex;
  gap: 5px;
  flex-direction: column;
`;

const TaskWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 20px;

  & > div:not(:first-child) {
    color: gray;
    width: 30px;
    text-align: center;
  }

  &.translate > div {
    :first-child {
      color: #cfcfcf;
    }
    :nth-child(2) {
      color: gray;
    }
  }
  &.transcribe > div {
    :nth-child(2) {
      color: #cfcfcf;
    }
    :first-child {
      color: gray;
    }
  }
`;

const Submit = styled.button`
  background-color: #6868ac;
  font-weight: 400;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 15px;
  padding: 10px;
  cursor: pointer;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: space-around;
`;

const Download = styled.div`
  border: 1px dashed #8d98b581;
  border-radius: 4px;
  width: 200px;
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  & > a.download_item {
    width: 50px;
    text-decoration: none;
    color: gray;
    font-size: 10px;
  }

  & > div:has(+ a) {
    display: none;
  }
`;

const Upload = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  &.active {
    display: none;
  }
`;

const FileList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px;
  border: 1px solid #cfcfcf;
  border-radius: 4px;
`;

const File = styled.div`
  align-items: center;
  font-size: 12px;
  font-weight: 400;
  display: flex;
  gap: 5px;
  padding: 2px;
`;

const Check = styled.div`
  color: blue;
  font-weight: 200;
  margin-left: 25px;
`;
