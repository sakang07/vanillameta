import React, { useEffect, useState } from 'react';
import { BarChart, MultilineChart, PieChart } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { useAlert } from 'react-alert';
import TemplateService from '@/api/templateService';
import WidgetService from '@/api/widgetService';
import { STATUS } from '@/constant';
import CloseButton from '@/components/button/CloseButton';
import { ReactComponent as TemplateIcon01 } from '@/assets/images/template/template01.svg';
import { ReactComponent as TemplateIcon02 } from '@/assets/images/template/template02.svg';
import { ReactComponent as TemplateIcon03 } from '@/assets/images/template/template03.svg';
import { ReactComponent as TemplateIcon04 } from '@/assets/images/template/template04.svg';
import { ReactComponent as TemplateIcon05 } from '@/assets/images/template/template05.svg';
import { ReactComponent as TemplateIcon06 } from '@/assets/images/template/template06.svg';
import { ReactComponent as TemplateIcon07 } from '@/assets/images/template/template07.svg';
import { ReactComponent as TemplateIcon08 } from '@/assets/images/template/template08.svg';
import { ReactComponent as TemplateIcon09 } from '@/assets/images/template/template09.svg';
import { ReactComponent as TemplateIcon10 } from '@/assets/images/template/template10.svg';

const iconType = item => {
  switch (item.toUpperCase()) {
    case 'CHART_BAR':
      return <BarChart />;
    case 'CHART_PIE':
      return <PieChart />;
    case 'CHART_LINE':
      return <MultilineChart />;
    default:
      return;
  }
};

const getTemplateIcon = id => {
  let icon = null;
  switch (id) {
    case 7:
      icon = <TemplateIcon01 style={{ width: '100%', height: '100%' }} />;
      break;
    case 8:
      icon = <TemplateIcon02 style={{ width: '100%', height: '100%' }} />;
      break;
    case 9:
      icon = <TemplateIcon03 style={{ width: '100%', height: '100%' }} />;
      break;
    case 10:
      icon = <TemplateIcon04 style={{ width: '100%', height: '100%' }} />;
      break;
    case 11:
      icon = <TemplateIcon05 style={{ width: '100%', height: '100%' }} />;
      break;
    case 12:
      icon = <TemplateIcon06 style={{ width: '100%', height: '100%' }} />;
      break;
    case 13:
      icon = <TemplateIcon07 style={{ width: '100%', height: '100%' }} />;
      break;
    case 14:
      icon = <TemplateIcon08 style={{ width: '100%', height: '100%' }} />;
      break;
    case 15:
      icon = <TemplateIcon09 style={{ width: '100%', height: '100%' }} />;
      break;
    case 16:
      icon = <TemplateIcon10 style={{ width: '100%', height: '100%' }} />;
      break;
  }
  return icon;
};

export const WidgetList = ({ handleWidgetConfirm = null, handleWidgetCancel = null, selectedWidgetIds = [] }) => {
  const alert = useAlert();
  const [loadedWidgetData, setLoadedWidgetData] = useState([]);
  const [selectedIds, setSelectedIds] = useState(selectedWidgetIds);

  useEffect(() => {
    getItems();

    console.log('몇번 호출 되는거싱ㄴ가', selectedWidgetIds);
  }, []);

  useEffect(() => {
    setSelectedIds(selectedWidgetIds);
  }, [selectedWidgetIds]);

  const getItems = () => {
    WidgetService.selectWidgetList().then(response => {
      if (response.data.status == STATUS.SUCCESS) {
        setLoadedWidgetData(response.data.data);
      } else {
        console.log('조회 실패!!!!');
      }
    });
  };

  const handleClick = item => {
    const isSelect = isItemSelection(item);
    const newIds = [...selectedIds];
    if (isSelect) {
      const index = newIds.indexOf(item.id);
      newIds.splice(index, 1);
      setSelectedIds(newIds);
    } else {
      newIds.push(item.id);
      setSelectedIds(newIds);
    }
  };

  const isItemSelection = item => {
    return !!selectedIds.find(id => id === item.id);
  };

  // 취소 버튼 클릭
  const handleCancelClick = () => {
    if (handleWidgetCancel) {
      handleWidgetCancel();
    }
  };

  // 다음 버튼 클릭
  const handleConfirmClick = () => {
    const widgets = [];
    for (let i = 0; i < loadedWidgetData.length; i++) {
      if (selectedIds.indexOf(loadedWidgetData[i].id) > -1) {
        widgets.push(loadedWidgetData[i]);
      }
    }

    if (widgets.length > 0) {
      if (handleWidgetConfirm) {
        handleWidgetConfirm(widgets);
      }
    } else {
      alert.info('위젯을 선택하세요.');
    }
  };

  return (
    <React.Fragment>
      <DialogContent dividers id="scroll-dialog-description" tabIndex={-1} sx={{ p: 0 }}>
        <List
          sx={{
            width: 600,
            minWidth: 400,
            height: 500,
            minHeight: 300,
          }}
        >
          {loadedWidgetData.map((item, index) => (
            <ListItemButton key={index} selected={isItemSelection(item)} onClick={() => handleClick(item)}>
              <ListItemIcon>{iconType(item.componentType)}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancelClick} color="inherit">
          취소
        </Button>
        <Button onClick={handleConfirmClick}>다음</Button>
      </DialogActions>
    </React.Fragment>
  );
};

export const TemplateList = ({ handleWidgetConfirm = null, handleWidgetCancel = null, selectedWidgetIds = null }) => {
  const alert = useAlert();
  const [loadedTemplateDataList, setLoadedTemplateDataList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const getItems = () => {
    TemplateService.selectRecommendTemplateList({ widgets: selectedWidgetIds }).then(response => {
      if (response.data.status == STATUS.SUCCESS) {
        setLoadedTemplateDataList(response.data.data);
      } else {
        console.log('조회 실패!!');
      }
    });
  };

  useEffect(() => {
    setSelectedItem(null);
    getItems();
  }, []);

  // 취소 버튼 클릭
  const handleCancelClick = () => {
    if (handleWidgetCancel) {
      handleWidgetCancel();
    }
  };

  // 선택완료 버튼 클릭
  const handleConfirmClick = () => {
    // 선택된 템플릿을 대시보드에 넘겨준다.
    if (selectedItem) {
      if (handleWidgetConfirm) {
        handleWidgetConfirm(selectedItem);
      }
    } else {
      alert.info('템플릿을 선택하세요.');
    }
  };

  const handleItemClick = item => {
    console.log('click item', item);
    setSelectedItem(item);
  };

  return (
    <>
      <DialogContent dividers id="scroll-dialog-description" sx={{ width: '100%', height: '602px', padding: '24px' }}>
        <Grid container columns={{ xs: 10 }} spacing="24px" sx={{ height: '100%' }}>
          {loadedTemplateDataList.map(item => {
            const selected = selectedItem?.id === item.id;
            return (
              <Grid item xs={2}>
                <Stack
                  justifyContent="center"
                  alignItems="center"
                  direction="column"
                  sx={{
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    height: '266px',
                    gap: '12px',
                    padding: '12px 12px 20px',
                    backgroundColor: selected ? '#edf8ff' : '#f5f6f8',
                    borderRadius: '6px',
                    border: selected ? 'solid 1px #0f5ab2' : 'solid 1px #f5f6f8',
                  }}
                  onClick={() => handleItemClick(item)}
                >
                  <Box sx={{ width: '100%', height: '100%', margin: 0 }}>{getTemplateIcon(item.id)}</Box>
                  <span
                    style={{
                      height: '20px',
                      flexGrow: '0',
                      fontFamily: 'Pretendard',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      fontStretch: 'normal',
                      fontStyle: 'normal',
                      lineHeight: '1.43',
                      letterSpacing: 'normal',
                      textAlign: 'left',
                      color: selected ? '#0f5ab2' : '#333333',
                    }}
                  >
                    {item.title}
                  </span>
                  <span
                    style={{
                      height: '44px',
                      flexGrow: '0',
                      fontFamily: 'Pretendard',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      fontStretch: 'normal',
                      fontStyle: 'normal',
                      lineHeight: '1.57',
                      letterSpacing: 'normal',
                      textAlign: 'left',
                      color: '#767676',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      width: '224px',
                      // whiteSpace: 'nowrap',
                    }}
                  >
                    {item.description}
                  </span>
                </Stack>
              </Grid>
            );
          })}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ height: '63px' }}>
        <Button onClick={handleCancelClick} color="inherit">
          뒤로가기
        </Button>
        <Button onClick={handleConfirmClick}>선택완료</Button>
      </DialogActions>
    </>
  );
};

function RecommendDashboardPopup({ recommendOpen = false, handleComplete = null }) {
  const [open, setOpen] = useState(recommendOpen);
  const title = '대시보드 추천 생성';
  const [subTitle, setSubTitle] = useState('위젯을 선택하세요');
  const [step, setStep] = useState(1);
  const [selectedWidgetIds, setSelectedWidgetIds] = useState([]);

  useEffect(() => {
    setOpen(recommendOpen);
  }, [recommendOpen]);

  useEffect(() => {
    if (open) {
      setStep(1);
    }
  }, [open]);

  useEffect(() => {
    if (step == 1) {
      setSubTitle('위젯을 선택하세요');
    } else if (step == 2) {
      setSubTitle('템플릿을 선택하세요');
    }
  }, [step]);

  // 창 닫기
  const handleClose = () => {
    setOpen(false);
  };

  // 취소 버튼
  const handleCancelClick = () => {
    if (step == 1) {
      // 위젯 선택화면에서 다음 버튼 클릭
      handleClose();
    } else if (step == 2) {
      // 템플릿 선택화면에서 완료 클릭
      setStep(1); // step 1 로 이동
    }
  };

  // 다음 버튼
  const handleConfirmClick = items => {
    if (step == 1) {
      // 위젯 선택화면에서 다음 버튼 클릭
      const tempIds = [];
      items.map(item => {
        tempIds.push(item.id);
      });

      setSelectedWidgetIds(tempIds);
      setStep(2); // step 2 로 이동
    } else if (step == 2) {
      // 템플릿 선택화면에서 완료 클릭
      // todo 대시보드에 layout, widgets 정보 전달
      if (handleComplete) {
        const item = {
          templateId: items.id,
          widgets: selectedWidgetIds,
        };
        getTemplateResult(item);
      }
    }
  };

  const getTemplateResult = item => {
    console.log('aaa');
    TemplateService.selectRecommendTemplateListDashboard(item).then(response => {
      if (response.data.status == STATUS.SUCCESS) {
        handleComplete(response.data.data);
      } else {
        console.log('조회 실패!!');
      }
    });
  };

  return (
    <>
      {step == 1 ? (
        <Dialog
          open={open}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
          fullWidth={true}
          sx={{
            '& .MuiDialog-container': {
              '& .MuiPaper-root': {
                width: '100%',
                maxWidth: '600px', // Set your width here
              },
            },
          }}
        >
          <DialogTitle
            id="scroll-dialog-title"
            sx={{ width: '100%', paddingLeft: '21px', paddingTop: '13px', height: '87px' }}
          >
            <span
              style={{
                height: '24px',
                fontFamily: 'Pretendard',
                fontSize: '20px',
                fontWeight: '600',
                fontStretch: 'normal',
                fontStyle: 'normal',
                lineHeight: 'normal',
                letterSpacing: 'normal',
                textAlign: 'left',
                color: '#141414',
              }}
            >
              {title}
            </span>

            <CloseButton
              sx={{
                position: 'absolute',
                right: '0px',
                top: '0px',
                paddingRight: '18.9px',
                paddingTop: '20.4px',
                cursor: 'pointer',
              }}
              size="medium"
              onClick={event => {
                event.preventDefault();
                event.stopPropagation();
                handleClose();
              }}
            />
            <Typography
              variant="body2"
              sx={{
                height: '17px',
                flexGrow: 0,
                fontFamily: 'Pretendard',
                fontSize: '14px',
                fontWeight: 'normal',
                fontStretch: 'normal',
                fontStyle: 'normal',
                lineHeight: 'normal',
                letterSpacing: 'normal',
                textAlign: 'left',
                color: '#767676',
                paddingTop: '6px',
              }}
            >
              {subTitle}
            </Typography>
          </DialogTitle>
          <WidgetList
            handleWidgetConfirm={handleConfirmClick}
            handleWidgetCancel={handleCancelClick}
            selectedWidgetIds={selectedWidgetIds}
          />
        </Dialog>
      ) : (
        <Dialog
          open={open}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
          fullWidth={true}
          sx={{
            '& .MuiDialog-container': {
              '& .MuiPaper-root': {
                width: '100%',
                minWidth: '1000px', // Set your width here
                maxWidth: '1392px', // Set your width here
              },
            },
          }}
        >
          <DialogTitle
            id="scroll-dialog-title"
            sx={{ width: '100%', paddingLeft: '21px', paddingTop: '13px', height: '87px' }}
          >
            <span
              style={{
                height: '24px',
                fontFamily: 'Pretendard',
                fontSize: '20px',
                fontWeight: '600',
                fontStretch: 'normal',
                fontStyle: 'normal',
                lineHeight: 'normal',
                letterSpacing: 'normal',
                textAlign: 'left',
                color: '#141414',
              }}
            >
              {title}
            </span>

            <CloseButton
              sx={{
                position: 'absolute',
                right: '0px',
                top: '0px',
                paddingRight: '18.9px',
                paddingTop: '20.4px',
                cursor: 'pointer',
              }}
              size="medium"
              onClick={event => {
                event.preventDefault();
                event.stopPropagation();
                handleClose();
              }}
            />
            <Typography
              variant="body2"
              sx={{
                height: '17px',
                flexGrow: 0,
                fontFamily: 'Pretendard',
                fontSize: '14px',
                fontWeight: 'normal',
                fontStretch: 'normal',
                fontStyle: 'normal',
                lineHeight: 'normal',
                letterSpacing: 'normal',
                textAlign: 'left',
                color: '#767676',
                paddingTop: '6px',
              }}
            >
              {subTitle}
            </Typography>
          </DialogTitle>
          <TemplateList
            handleWidgetConfirm={handleConfirmClick}
            handleWidgetCancel={handleCancelClick}
            selectedWidgetIds={selectedWidgetIds}
          />
        </Dialog>
      )}
    </>
  );
}
export default RecommendDashboardPopup;
