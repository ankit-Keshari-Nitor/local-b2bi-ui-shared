import React, { useState, useEffect } from 'react';
import { FormItem, FileUploaderDropContainer, FileUploaderItem } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { Controller, useFormContext } from 'react-hook-form';
import { processRules } from './FormUtils';

function convertToBytes(sizeStr) {
  // Regular expression to match the size string
  const sizePattern = /(\d+(\.\d+)?)(b|kb|mb)/i;
  const match = sizeStr.match(sizePattern);

  if (!match) {
    throw new Error("Invalid size format. Use format like '500b', '500kb', or '500mb'.");
  }

  const value = parseFloat(match[1]);
  const unit = match[3].toLowerCase();

  let bytes;

  switch (unit) {
    case 'b':
      bytes = value;
      break;
    case 'kb':
      bytes = value * 1024;
      break;
    case 'mb':
      bytes = value * 1024 * 1024;
      break;
    default:
      throw new Error("Unsupported unit. Use 'b', 'kb', or 'mb'.");
  }

  return bytes;
}

function formatFileFormats(fileFormats) {
  if (!Array.isArray(fileFormats) || fileFormats.length === 0) {
    return '';
  }

  if (fileFormats.length === 1) {
    return fileFormats[0];
  }

  const lastFormat = fileFormats.pop();
  return `${fileFormats.join(', ')} and ${lastFormat}`;
}

const FileUpload = ({ name, labelText, accept, maxFileSize, disabled, onChange, onDelete, value, rules, ...props }) => {
  const [file, setFile] = useState();
  const { t } = useTranslation();
  const processedRules = processRules(rules, t);
  const { control } = useFormContext();

  const onAddFiles = function (event, files) {
    const file = event.target.files || files.addedFiles;

    const newFile = [
      {
        name: file[0].name,
        filesize: file[0].size,
        status: 'edit',
        iconDescription: t('shell:common.actions.deleteFile'),
        invalidFileType: file[0].invalidFileType
      }
    ];
    setFile(newFile[0]);
    uploadFile([newFile[0]]);
    onChange(event, files);
  };

  const uploadFile = async function (fileToUpload) {
    const defaultFilesize = '5mb';
    if (fileToUpload[0].invalidFileType) {
      const updatedFile = {
        ...fileToUpload[0],
        status: 'edit',
        iconDescription: t('shell:common.actions.deleteFile'),
        invalid: true,
        errorSubject: t('shell:common.errors.invalidFileType_title'),
        errorBody: t('shell:common.errors.invalidFileType_description', { fileName: fileToUpload[0].name, fileType: accept.join(',') })
      };
      setFile(updatedFile);
      return;
    } else if (fileToUpload[0].filesize > convertToBytes(maxFileSize || defaultFilesize)) {
      const updatedFile = {
        ...fileToUpload[0],
        status: 'edit',
        iconDescription: t('shell:common.actions.deleteFile'),
        invalid: true,
        errorSubject: t('shell:common.errors.fileSizeLimit_title'),
        errorBody: t('shell:common.errors.fileSizeLimit_description', { maxFileSize: maxFileSize || defaultFilesize })
      };

      setFile(updatedFile);
      return;
    }
  };

  const onDeleteFile = function (...args) {
    setFile();
    onDelete();
  };

  useEffect(() => {
    if (value === undefined) {
      setFile(value);
    }
  }, [value]);

  return (
    <Controller
      control={control}
      name={name}
      rules={processedRules}
      disabled={disabled}
      render={({ field: { onChange, onBlur, value, disabled, name, ref }, fieldState: { invalid, isTouched, isDirty, error }, formState }) => {
        const id = control?._options.name ? control._options.name + '.' + name : name;

        return file === undefined ? (
          <FormItem className="cds--file-upload-container">
            <p className="cds--label-description">
              {maxFileSize && t('shell:common.messages.fileUploadSizeDescription', { maxFileSize: maxFileSize })}&nbsp;
              {accept && accept?.length > 0 && t('shell:common.messages.fileUploadFormatDescription', { supportedFileFormats: formatFileFormats([...accept]) })}
            </p>
            <FileUploaderDropContainer
              className={invalid ? 'cds--file__drop-container-error' : ''}
              accept={accept}
              innerRef={{
                current: '[Circular]'
              }}
              labelText={t('shell:common.actions.fileUpload')}
              name={name}
              id={id}
              onAddFiles={(event, files) => {
                onAddFiles(event, files);
                onChange(files);
              }}
              onChange={onAddFiles}
              disabled={disabled}
            />
            {error && <div className="cds--form-requirement">{error?.message}</div>}
          </FormItem>
        ) : (
          <div className="cds--file-container cds--file-container--drop" name={name}>
            <div className="cds--text-input__label-wrapper">
              <label className="cds--label" dir="auto">
                {labelText}
              </label>
            </div>
            <FileUploaderItem
              id={id}
              errorSubject={file.errorSubject}
              errorBody={file.errorBody}
              iconDescription={file.iconDescription}
              onDelete={() => {
                onDeleteFile();
                onChange(undefined);
              }}
              size="md"
              status="edit"
              name={file.name}
              filesize={file.filesize}
              invalid={file.invalid}
            />
          </div>
        );
      }}
    ></Controller>
  );
};

export default FileUpload;
