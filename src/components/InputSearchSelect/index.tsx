import React, { useEffect, useState } from 'react';
import { CloseCircleFilled } from '@ant-design/icons';
import { colors } from 'styles/variables';
import { addOpacity } from 'styles/utils';

interface Props {
  value: string;
  options: { label: string; value: string }[];
  placeholder?: string;
  style?: React.CSSProperties | undefined;
  onSearch: (value: string) => void;
  onChange: (value: string) => void;
}

export default function InputSearchSelect({
  value: PropsValue,
  options,
  placeholder,
  style,
  onSearch,
  onChange,
}: Props) {
  const [value, setValue] = useState<string>('');
  const [active, setActive] = useState(false);

  useEffect(() => {
    setValue(PropsValue);
  }, [PropsValue]);

  return (
    <>
      <div
        style={style}
        className="select"
        onClick={() => setActive(true)}
        onBlur={() => {
          setTimeout(() => {
            setActive(false);
          }, 100);
        }}
      >
        <div className={`input-content ${active ? 'active' : 'not-active'}`}>
          <input
            type="text"
            value={value}
            placeholder={placeholder}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setValue(e.target.value);
              onSearch(e.target.value);
            }}
          />
          {!!value.length && (
            <CloseCircleFilled
              style={{
                cursor: 'pointer',
                opacity: 0.8,
                position: 'absolute',
                right: '5px',
                top: '25%',
              }}
              onClick={() => {
                onSearch('');
                onChange('');
              }}
            />
          )}
        </div>
        {active && (
          <div className="options">
            {options.map((option, i) => (
              <div
                key={`${option.value}-${i}`}
                className="option"
                data-value={option.value}
                onClick={(e: any) => {
                  onChange(e.target.dataset.value);
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
      <style jsx>{`
        .select {
          background-color: ${colors.white};
          display: inline-block;
          position: relative;
        }

        .input-content {
          border-radius: 2px;
          border-style: solid;
          border-width: 1px;
          color: ${colors.black};
          cursor: default;
          font-size: 16px;
          line-height: 1.5715;
          padding: 5px 25px 5px 0px;
          position: relative;
          transition: border-color 0.4s ease, box-shadow 0.4s ease;
        }

        .input-content.not-active {
          border-color: ${colors.gray};
        }

        .select:hover .input-content,
        .input-content.active {
          border-color: ${colors.primary};
          box-shadow: 0 0 0 0.1rem
            ${addOpacity({ color: colors.primary, opacity: 0.4 })};
        }

        input {
          background-color: transparent;
          border: none;
          display: inline-block;
          margin: 0;
          outline: none;
          overflow: hidden;
          padding: 0 0 0 10px;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 100%;
        }

        input::placeholder {
          color: ${addOpacity({ color: colors.gray, opacity: 0.9 })};
        }

        .options {
          animation: optionsAnimation 0.5s ease both;
          background-color: ${colors.white};
          cursor: pointer;
          position: absolute;
          top: 100%;
          width: 100%;
        }

        .option {
          font-size: 16px;
          overflow: hidden;
          padding: 5px 10px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .option:hover {
          background-color: ${addOpacity({ color: colors.gray, opacity: 0.2 })};
        }

        @keyframes optionsAnimation {
          from {
            opacity: 0;
            transform: translateY(-5%);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
