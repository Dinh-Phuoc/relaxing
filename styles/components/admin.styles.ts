import styled from 'styled-components';

export const AdminContainer = styled.div`
    max-width: 900px;
    margin: 48px auto;
    padding: 0 24px;
`;

export const AdminHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 32px;
`;

export const AdminIconBox = styled.div`
    width: 44px;
    height: 44px;
    border-radius: ${({ theme }) => theme.radii.xl};
    background: rgba(229, 9, 20, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const AdminTitle = styled.h1`
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 28px;
    font-weight: 700;
`;

export const AdminSubtitle = styled.p`
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 14px;
    margin-top: 4px;
`;

export const AdminCard = styled.div`
    background: ${({ theme }) => theme.colors.surface};
    border-radius: ${({ theme }) => theme.radii['2xl']};
    padding: 28px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    margin-bottom: 24px;

    &:last-child {
        margin-bottom: 0;
    }
`;

export const AdminCardHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;
`;

export const AdminCardTitle = styled.h2`
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 18px;
    font-weight: 600;
`;

export const AdminForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

export const AdminFormGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
`;

export const AdminField = styled.div``;

export const AdminCheckboxRow = styled.div`
    display: flex;
    align-items: flex-end;
    padding-bottom: 4px;
`;

export const AdminCheckboxLabel = styled.label`
    display: flex;
    align-items: center;
    gap: 10px;
    color: ${({ theme }) => theme.colors.textSoft};
    font-size: 14px;
    cursor: pointer;
`;

export const AdminCheckbox = styled.input`
    width: 16px;
    height: 16px;
    accent-color: ${({ theme }) => theme.colors.accentRed};
`;

export const AdminSelect = styled.select`
    width: 100%;
    padding: 12px 16px;
    background: ${({ theme }) => theme.colors.inputBg};
    border: 1px solid ${({ theme }) => theme.colors.borderLight};
    border-radius: ${({ theme }) => theme.radii.lg};
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 15px;
    outline: none;
    cursor: pointer;
`;

export const SuccessAlert = styled.div`
    background: rgba(34, 197, 94, 0.1);
    border: 1px solid rgba(34, 197, 94, 0.3);
    border-radius: ${({ theme }) => theme.radii.md};
    padding: 12px;
    color: #86efac;
    font-size: 14px;
`;

export const UserList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export const UserListItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-radius: ${({ theme }) => theme.radii.lg};
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
`;

export const UserName = styled.p`
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 14px;
    font-weight: 600;
`;

export const UserMeta = styled.p`
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 12px;
`;

export const UserBadgeRow = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

export const StatusBadge = styled.span<{ $active?: boolean }>`
    font-size: 12px;
    font-weight: 600;
    color: ${({ $active }) => ($active ? '#22c55e' : '#606070')};
    background: ${({ $active }) =>
        $active ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.06)'};
    padding: 4px 10px;
    border-radius: 20px;
`;

export const RoleBadge = styled.span<{ $color: string }>`
    font-size: 12px;
    font-weight: 600;
    color: ${({ $color }) => $color};
    background: ${({ $color }) => `${$color}20`};
    padding: 4px 10px;
    border-radius: 20px;
`;

export const LoadingText = styled.p`
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 14px;
`;
