import { FC, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { FamilyIcon, ArrowBackIcon as CaretIcon } from '@/shared/icons';
import { formatDate } from '@/shared/lib/date';
import { useFamily } from '@/shared/lib/insurance';
import { useTheme } from '@/shared/theme';

interface FamilyMembersProps {
  programId: string;
}

export const FamilyMembers: FC<FamilyMembersProps> = ({ programId }) => {
  const [show, setShow] = useState(false);
  const { colors } = useTheme();
  const { family, loadingFamily } = useFamily(programId);

  if (loadingFamily) {
    return <ActivityIndicator color={colors.primary} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.gray['200'] }]}>
      <TouchableOpacity
        style={[styles.trigger]}
        onPress={() => setShow(prevState => !prevState)}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <FamilyIcon width={24} height={24} color={colors.blue['370']} />
          <Text style={[styles.triggerText, { color: colors.blue['370'] }]}>
            Прикрепленные члены семьи
          </Text>
        </View>
        <CaretIcon
          style={{
            transform: [{ rotate: show ? '90deg' : '-90deg' }],
          }}
        />
      </TouchableOpacity>
      {show && (
        <View style={styles.members}>
          {family?.map(member => (
            <View
              key={member.id}
              style={[
                styles.memberContainer,
                {
                  backgroundColor: colors.blue['100'],
                  borderColor: colors.primary,
                },
              ]}
            >
              <View style={{ gap: 4 }}>
                <Text style={[styles.memberName, { color: colors.primary }]}>
                  {member.fullName}
                </Text>
                <Text
                  style={[
                    styles.memberBirthDate,
                    { color: colors.gray['600'] },
                  ]}
                >
                  {formatDate(member.dateBirth, 'DD.MM.YYYY')}
                </Text>
              </View>
              <Text
                style={[styles.memberRelationship, { color: colors.primary }]}
              >
                {member.relationship}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    paddingHorizontal: 18,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 18,
  },
  triggerText: {
    fontWeight: 600,
    fontSize: 16,
  },
  members: {
    gap: 4,
    marginBottom: 18,
  },
  memberContainer: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  memberName: {
    fontSize: 14,
    fontWeight: 400,
  },
  memberBirthDate: {
    fontSize: 12,
    fontWeight: 400,
  },
  memberRelationship: {
    fontSize: 12,
    fontWeight: 600,
  },
});
