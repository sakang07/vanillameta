import React, { useContext, useEffect, useState } from 'react';
import { Box, Modal, Paper, IconButton, Stack, Typography } from '@mui/material';
import DatabaseService from '@/api/databaseService';
import { STATUS } from '@/constant';
import { useAlert } from 'react-alert';
import { DatabaseCardList } from '@/components/list/DatabaseCardList';
import { DatasetCardList } from '@/components/list/DatasetCardList';
import DatasetService from '@/api/datasetService';
import AddButton from '@/components/button/AddButton';
import { Link as RouterLink } from 'react-router-dom';
import { LoadingContext } from '@/contexts/LoadingContext';
import { SnackbarContext } from '@/contexts/AlertContext';
import { ReactComponent as CloseIcon } from '@/assets/images/icon/ic-xmark.svg';

export interface DataSetProps {
  id: number;
  databaseId: number;
  datasetType: 'TABLE' | 'DATASET';
  title: string;
  query: string;
  createdAt: string;
  updatedAt: string;
}

export interface DataTableProps {
  id: number;
  tableName: string;
  databaseId: number;
  datasetType: 'TABLE' | 'DATASET';
}

const DataLayout = props => {
  const { isViewMode, setDataSet } = props;
  const [databaseList, setDatabaseList] = useState([]);
  const [datasetList, setDatasetList] = useState<DataSetProps[]>([]);
  const [tableList, setTableList] = useState<DataTableProps[]>([]);
  const alert = useAlert();
  const snackbar = useAlert(SnackbarContext);
  const { showLoading, hideLoading } = useContext(LoadingContext);
  const [selectedDatabase, setSelectedDatabase] = useState({ databaseId: null });
  const [selectedDataset, setSelectedDataset] = useState<DataSetProps | DataTableProps | null>(null);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    getDatabaseList();
  }, []);

  useEffect(() => {
    if (selectedDatabase.databaseId) getDatabaseInfo();
  }, [selectedDatabase.databaseId]);

  /**
   * 데이터베이스 목록조회
   */
  const getDatabaseList = () => {
    showLoading();
    DatabaseService.selectDatabaseList()
      .then(response => {
        setDatabaseList(response.data.data);
        if (response.data.data.length > 0) {
          setSelectedDatabase({ databaseId: response.data.data[0].id });
        }
      })
      .finally(() => {
        hideLoading();
      });
  };

  const getDatabaseInfo = () => {
    showLoading();
    DatabaseService.selectDatabase(selectedDatabase.databaseId)
      .then(response => {
        if (response.data.status === 'SUCCESS') {
          setDatasetList(response.data.data.datasets);
          setTableList(response.data.data.tables);
        } else {
          alert.error('데이터베이스 조회에 실패했습니다.\n다시 시도해 주세요.');
          setDatasetList([]);
          setTableList([]);
        }
      })
      .catch(error => {
        snackbar.error(error.message);
        setDatasetList([]);
        setTableList([]);
      })
      .finally(() => {
        hideLoading();
      });
  };

  const handleSelectDatabase = enteredData => {
    return setSelectedDatabase(prevState => ({ ...prevState, ...enteredData }));
  };

  const handleDatabaseRemove = (id, name) => {
    console.log('handleDatabaseRemove', id);
    alert.success(`${name}\n데이터베이스를 삭제하시겠습니까?`, {
      title: '데이터베이스 삭제',
      closeCopy: '취소',
      actions: [
        {
          copy: '삭제',
          onClick: () => {
            DatabaseService.deleteDatabase(id).then(response => {
              if (response.data.status === STATUS.SUCCESS) {
                getDatabaseList();
                snackbar.success('데이터베이스가 삭제되었습니다.');
              }
            });
          },
        },
      ],
    });
  };

  const handleDataSetClick = (item: DataTableProps | DataSetProps) => {
    setOpen(true);
    if (setDataSet) {
      setDataSet(item);
      setSelectedDataset(item);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDataSetRemove = item => {
    console.log('handleDataSetRemove', item);
    alert.success(`${item.title}\n데이터셋을 삭제하시겠습니까?`, {
      title: '데이터베이스 삭제',
      closeCopy: '취소',
      actions: [
        {
          copy: '삭제',
          onClick: () => {
            DatasetService.deleteDataset(item.id).then(() => {
              getDatabaseInfo();
              snackbar.success('데이터셋이 삭제되었습니다.');
            });
          },
        },
      ],
    });
  };

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} flex="1 1 auto" sx={{ width: '100%' }}>
      <Stack
        direction="column"
        flex="1 1 auto"
        sx={{ width: { xs: '100%', md: '404px' }, height: '100%', px: '24px', pt: '30px' }}
      >
        <Stack direction="row" sx={{ mb: '12px' }}>
          <Typography variant="subtitle1" component="span" sx={{ fontWeight: 'bold', fontSize: '16px', color: '#141414' }}>
            데이터 소스
          </Typography>
          {isViewMode ? <></> : <AddButton component={RouterLink} to={`source/create`} sx={{ ml: '14px' }} />}
        </Stack>
        <DatabaseCardList
          data={databaseList}
          selectedDatabase={selectedDatabase}
          disabledIcons={!!isViewMode}
          onUpdate={handleSelectDatabase}
          onRemove={handleDatabaseRemove}
          minWidth="100%"
        />
      </Stack>

      <Stack
        direction="column"
        sx={{
          flex: '1 1 auto',
          width: { xs: '100%', md: 'calc(100% - 404px)' },
          backgroundColor: '#f5f6f8',
        }}
      >
        <Stack direction="column" sx={{ width: '100%', px: '24px', pt: '30px' }}>
          <Stack direction="row" sx={{ mb: '12px' }}>
            <Typography variant="subtitle1" component="span" sx={{ fontWeight: 'bold', fontSize: '16px', color: '#141414' }}>
              데이터 셋
            </Typography>
            {isViewMode ? (
              <></>
            ) : (
              <AddButton component={RouterLink} to={`set/create/${selectedDatabase.databaseId}`} sx={{ ml: '14px' }} />
            )}
          </Stack>
          <DatasetCardList
            data={datasetList}
            selectedDataset={selectedDataset}
            handleDataSetClick={handleDataSetClick}
            handleDataSetRemove={handleDataSetRemove}
          />
        </Stack>
        <Stack direction="column" sx={{ flex: '1 1 auto', width: '100%', minHeight: '50%', px: '24px', pt: '30px' }}>
          <Stack direction="row" sx={{ mb: '12px' }}>
            <Typography variant="subtitle1" component="span" sx={{ fontWeight: 'bold', fontSize: '16px', color: '#141414' }}>
              테이블 목록
            </Typography>
          </Stack>
          <DatasetCardList
            sx={{ flex: '1 1 auto' }}
            data={tableList}
            selectedDataset={selectedDataset}
            handleDataSetClick={handleDataSetClick}
          />
          <Modal
            open={open}
            onClose={handleClose}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            BackdropProps={{
              sx: {
                boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
                backgroundColor: 'rgba(122, 130, 144, 0.45)',
              },
            }}
          >
            <Paper
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '90%',
                height: '80%',
                minHeight: '500px',
                borderRadius: '8px',
                boxShadow: '5px 5px 8px 0 rgba(0, 28, 71, 0.15)',
                border: 'solid 1px #ddd',
                p: '10px',
                pt: 0,
                backgroundColor: '#fff',
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" m="20px">
                <Typography sx={{ fontSize: '20px', fontWeight: 600, color: '#141414' }}>제목</Typography>
                <IconButton>
                  <CloseIcon width="16" height="16" />
                </IconButton>
              </Stack>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                  backgroundColor: '#e2e2e2',
                }}
              >
                내용
              </Box>
            </Paper>
          </Modal>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default DataLayout;
